from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timezone
import os
import google.generativeai as genai

# ---------------------- GEMINI AI CONFIG ----------------------
API_KEY = "AIzaSyDZhyArJmCEXXFP7oTc9GLtm4_I6CNWsJo"
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash-lite")

# System prompt for Clancy AI
CLANCY_SYSTEM_PROMPT = """You are Clancy AI, the customer support chatbot for Cleanzy, a smart waste management company. 

Your responsibilities:
- Answer all customer questions about Cleanzy's products, services, and processes in a helpful, professional, and friendly manner
- If a customer asks about scheduling a new pickup, direct them to http://localhost:5173/booking
- If a customer wants to track their order or waste pickup, redirect them to http://localhost:5173/dashboard
- If you do not have enough information to answer a customer's question, politely inform them you do not know and offer to escalate the issue or direct them to a human support representative
- Always provide clear, concise, and polite responses, following Cleanzy's tone and policies
- Do not answer questions outside Cleanzy's scope

Keep responses brief and friendly. Use emojis sparingly for a modern touch."""

# Store chat sessions (in production, use Redis or database)
chat_sessions = {}

app = Flask(__name__)

# ---------------------- DATABASE CONFIG ----------------------
DB_FILE = 'databaseBk.db'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_FILE}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key_here'

# ---------------------- CORS ----------------------
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

db = SQLAlchemy(app)

# ---------------------- MODELS ----------------------
class User(db.Model):
    __tablename__ = 'user'
    userid = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    userphonenumber = db.Column(db.String(15), nullable=False)
    useremail = db.Column(db.String(120), unique=True, nullable=False)
    userlocation = db.Column(db.String(200), nullable=False)
    orders = db.relationship('Order', backref='user', lazy=True, cascade='all, delete-orphan')

class Driver(db.Model):
    __tablename__ = 'driver'
    driverid = db.Column(db.Integer, primary_key=True)
    drivername = db.Column(db.String(100), nullable=False)
    phonenumber = db.Column(db.String(15), nullable=False)
    platenumber = db.Column(db.String(20), unique=True, nullable=False)
    date = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    orders = db.relationship('Order', backref='driver', lazy=True, cascade='all, delete-orphan')

class Order(db.Model):
    __tablename__ = 'order'
    pickupid = db.Column(db.String(50), primary_key=True)
    wastetype = db.Column(db.String(100), nullable=False)
    pickuptime = db.Column(db.String(100), nullable=False)
    pickupdate = db.Column(db.Date, default=lambda: datetime.now(timezone.utc).date())
    userlocation = db.Column(db.String(200), nullable=False)
    estimatedcost = db.Column(db.Float, nullable=False)
    pickuprating = db.Column(db.Float, default=0.0)
    notes = db.Column(db.String(500), nullable=True)
    photo_filename = db.Column(db.String(200), nullable=True)
    userid = db.Column(db.Integer, db.ForeignKey('user.userid'), nullable=False)
    driverid = db.Column(db.Integer, db.ForeignKey('driver.driverid'), nullable=False)

    def to_dict(self):
        return {
            "pickupId": self.pickupid,
            "wasteType": self.wastetype,
            "pickupTime": self.pickuptime,
            "pickupDate": self.pickupdate.strftime("%Y-%m-%d"),
            "userLocation": self.userlocation,
            "cost": f"₹{self.estimatedcost}",
            "pickupRating": self.pickuprating,
            "notes": self.notes,
            "photoFilename": self.photo_filename,
            "userId": self.userid,
            "driverId": self.driverid,
        }

# ---------------------- DATABASE INITIALIZATION ----------------------
def init_db():
    """Initialize database with tables and sample data"""
    # Delete old database if it exists to avoid schema issues
    if os.path.exists(DB_FILE):
        print(f"🗑️  Removing old database: {DB_FILE}")
        try:
            os.remove(DB_FILE)
            print("✅ Old database deleted successfully")
        except Exception as e:
            print(f"⚠️  Could not delete old database: {e}")
            print("   Please manually delete 'databaseBk.db' and restart")
            return
    
    with app.app_context():
        # Create all tables with new schema
        db.create_all()
        print("📊 Database tables created with updated schema")
        
        # Add sample user ONLY if none exists
        if User.query.count() == 0:
            sample_user = User(
                username="John Doe",
                userphonenumber="9876543210",
                useremail="john@example.com",
                userlocation="123 Main St, Bangalore"
            )
            db.session.add(sample_user)
            print("👤 Sample user created")
        else:
            print("👤 Sample user already exists")
        
        # Add sample driver ONLY if none exists
        if Driver.query.count() == 0:
            sample_driver = Driver(
                drivername="Mike Driver",
                phonenumber="9123456789",
                platenumber="KA01AB1234"
            )
            db.session.add(sample_driver)
            print("🚗 Sample driver created")
        else:
            print("🚗 Sample driver already exists")
        
        db.session.commit()
        
        print("\n✅ Database initialized successfully!")
        print(f"   📊 Users: {User.query.count()}")
        print(f"   🚗 Drivers: {Driver.query.count()}")
        print(f"   📦 Orders: {Order.query.count()}\n")

# ---------------------- API ROUTES ----------------------
@app.route('/')
def home():
    return {"message": "Backend is running!", "status": "ok"}

# ---------------------- AUTH ROUTES ----------------------
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ["username", "email", "password", "userType"]
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            return jsonify({"error": f"Missing fields: {', '.join(missing_fields)}"}), 400
        
        # Check if email already exists
        existing_user = User.query.filter_by(useremail=data["email"]).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409
        
        # Create new user (in a real app, hash the password!)
        new_user = User(
            username=data["username"],
            useremail=data["email"],
            userphonenumber=data.get("phone", "0000000000"),
            userlocation=data.get("location", "Not provided")
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        print(f"✅ New user created: {data['username']} ({data['email']})")
        
        return jsonify({
            "success": True,
            "message": "Account created successfully!",
            "userId": new_user.userid,
            "userType": data["userType"]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Signup error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password required"}), 400
        
        # Find user by email
        user = User.query.filter_by(useremail=data["email"]).first()
        
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401
        
        # In a real app, verify hashed password here
        print(f"✅ User logged in: {user.username}")
        
        return jsonify({
            "success": True,
            "message": "Login successful!",
            "user": {
                "id": user.userid,
                "username": user.username,
                "email": user.useremail
            }
        }), 200
        
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Users
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        "userid": u.userid,
        "username": u.username,
        "userphonenumber": u.userphonenumber,
        "useremail": u.useremail,
        "userlocation": u.userlocation
    } for u in users])

# Profile (returns first user as the logged-in user)
@app.route('/api/profile', methods=['GET'])
def get_profile():
    user = User.query.first()
    if not user:
        return jsonify({"error": "No user found"}), 404
    
    return jsonify({
        "name": user.username,
        "email": user.useremail,
        "phone": user.userphonenumber,
        "city": "Bangalore",
        "address": user.userlocation
    })

# Drivers
@app.route('/api/drivers', methods=['GET'])
def get_drivers():
    drivers = Driver.query.all()
    return jsonify([{
        "driverid": d.driverid,
        "drivername": d.drivername,
        "phonenumber": d.phonenumber,
        "platenumber": d.platenumber,
        "date": d.date.strftime("%Y-%m-%d %H:%M:%S")
    } for d in drivers])

# Orders
@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([o.to_dict() for o in orders])

@app.route('/api/orders/<pickupid>', methods=['GET'])
def get_order(pickupid):
    order = Order.query.filter_by(pickupid=pickupid).first_or_404()
    return jsonify(order.to_dict())

# ---------------------- CREATE BOOKING ----------------------
@app.route('/api/bookings/create', methods=['POST'])
def create_booking():
    try:
        print("📥 Received booking request")
        print(f"   Content-Type: {request.content_type}")
        print(f"   Form data: {request.form.to_dict()}")
        print(f"   Files: {list(request.files.keys())}")
        
        # ---------------------- READ FORM DATA ----------------------
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            data = request.form.to_dict()
        else:
            data = request.get_json() or {}

        # ---------------------- VALIDATE REQUIRED FIELDS ----------------------
        required_fields = ["wasteType", "address", "pickupTime"]
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            error_msg = f"Missing required fields: {', '.join(missing_fields)}"
            print(f"❌ Validation error: {error_msg}")
            return jsonify({"error": error_msg}), 400

        # ---------------------- HANDLE OPTIONAL PHOTO ----------------------
        photo_file = request.files.get("photo")
        photo_filename = None
        if photo_file and photo_file.filename:
            os.makedirs("uploads", exist_ok=True)
            timestamp = int(datetime.now(timezone.utc).timestamp())
            photo_filename = f"uploads/{timestamp}_{photo_file.filename}"
            photo_file.save(photo_filename)
            print(f"📸 Photo saved: {photo_filename}")

        # ---------------------- ASSIGN USER AND DRIVER ----------------------
        user = User.query.first()
        driver = Driver.query.first()
        
        if not user or not driver:
            error_msg = "No user or driver available. Please ensure database is initialized."
            print(f"❌ Database error: {error_msg}")
            return jsonify({"error": error_msg}), 400

        # ---------------------- CALCULATE COST ----------------------
        base_prices = {
            "General Waste": 50,
            "Organic/Food Waste": 40,
            "Recyclable Waste": 30,
            "Electronic Waste": 80,
            "Construction Debris": 150,
            "Hazardous Waste": 200,
        }
        estimated_cost = base_prices.get(data["wasteType"], 50)

        # ---------------------- CREATE ORDER ----------------------
        pickup_id = str(int(datetime.now(timezone.utc).timestamp()))
        
        new_order = Order(
            pickupid=pickup_id,
            wastetype=data["wasteType"],
            pickuptime=data["pickupTime"],
            userlocation=data["address"],
            estimatedcost=float(estimated_cost),
            notes=data.get("notes", ""),
            photo_filename=photo_filename,
            userid=user.userid,
            driverid=driver.driverid
        )

        db.session.add(new_order)
        db.session.commit()

        print(f"✅ Booking created successfully!")
        print(f"   Booking ID: {pickup_id}")
        print(f"   Waste Type: {data['wasteType']}")
        print(f"   Cost: ₹{estimated_cost}")

        return jsonify({
            "success": True,
            "bookingId": new_order.pickupid,
            "message": "Booking created successfully!"
        }), 201

    except Exception as e:
        db.session.rollback()
        error_msg = str(e)
        print(f"❌ Error creating booking: {error_msg}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": error_msg}), 500

# ---------------------- CHATBOT API ----------------------
@app.route('/api/chat', methods=['POST'])
def chat_with_clancy():
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({"error": "Message is required"}), 400
        
        user_message = data['message']
        session_id = data.get('sessionId', 'default')
        
        print(f"💬 Chat request from session {session_id}: {user_message}")
        
        # Get or create chat session
        if session_id not in chat_sessions:
            chat_sessions[session_id] = model.start_chat(history=[])
            # Send system prompt first
            chat_sessions[session_id].send_message(CLANCY_SYSTEM_PROMPT)
        
        chat = chat_sessions[session_id]
        
        # Get response from Gemini
        response = chat.send_message(user_message)
        bot_response = response.text
        
        print(f"🤖 Clancy response: {bot_response[:100]}...")
        
        return jsonify({
            "success": True,
            "response": bot_response,
            "sessionId": session_id
        }), 200
        
    except Exception as e:
        print(f"❌ Chat error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Failed to get response from Clancy AI",
            "details": str(e)
        }), 500

@app.route('/api/chat/reset', methods=['POST'])
def reset_chat():
    try:
        data = request.get_json() or {}
        session_id = data.get('sessionId', 'default')
        
        if session_id in chat_sessions:
            del chat_sessions[session_id]
            print(f"🔄 Chat session {session_id} reset")
        
        return jsonify({
            "success": True,
            "message": "Chat session reset"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------- RUN APP ----------------------
if __name__ == '__main__':
    init_db()  # Initialize database on startup
    print("🚀 Starting Flask server on http://localhost:5000")
    print("📡 CORS enabled for http://localhost:5173")
    print("🤖 Clancy AI Chatbot initialized\n")
    app.run(debug=True, port=5000)