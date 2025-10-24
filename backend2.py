from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)

# ---------------------- CORS ----------------------
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}},
     supports_credentials=True)

# ---------------------- DATABASE CONFIG ----------------------
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///databaseBk.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key_here'

db = SQLAlchemy(app)

# ---------------------- ROOT ROUTE ----------------------
@app.route('/')
def home():
    return {"message": "Backend is running!"}

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
    date = db.Column(db.DateTime, default=datetime.utcnow)
    orders = db.relationship('Order', backref='driver', lazy=True, cascade='all, delete-orphan')

class Order(db.Model):
    __tablename__ = 'order'
    pickupid = db.Column(db.String(50), primary_key=True)
    wastetype = db.Column(db.String(100), nullable=False)
    pickuptime = db.Column(db.String(100), nullable=False)
    pickupdate = db.Column(db.Date, default=datetime.utcnow().date)
    userlocation = db.Column(db.String(200), nullable=False)
    estimatedcost = db.Column(db.Float, nullable=False)
    pickuprating = db.Column(db.Float, default=0.0)
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
            "userId": self.userid,
            "driverId": self.driverid,
        }

# ---------------------- API ROUTES ----------------------
# Users
@app.route('/api/user/profile', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "name": u.username,
            "email": u.useremail,
            "phone": u.userphonenumber,
            "city": "",
            "address": u.userlocation
        } for u in users
    ])

# Orders
@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([o.to_dict() for o in orders])

@app.route('/api/orders/<pickupid>', methods=['GET'])
def get_order(pickupid):
    order = Order.query.filter_by(pickupid=pickupid).first_or_404()
    return jsonify(order.to_dict())

# Bookings
@app.route('/api/bookings/create', methods=['POST'])
def create_booking():
    # Accept both FormData and JSON
    if request.form:
        data = request.form.to_dict()
    else:
        data = request.get_json() or {}

    required_fields = ["wasteType", "address", "pickupTime"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing field: {field}"}), 400

    try:
        # Dummy user and driver
        user = User.query.first()
        driver = Driver.query.first()
        if not user or not driver:
            return jsonify({"error": "No user or driver available"}), 400

        new_order = Order(
            pickupid=str(int(datetime.utcnow().timestamp())),
            wastetype=data["wasteType"],
            pickuptime=data["pickupTime"],
            userlocation=data["address"],
            estimatedcost=float(data.get("cost", 100)),
            userid=user.userid,
            driverid=driver.driverid
        )
        db.session.add(new_order)
        db.session.commit()

        return jsonify({
            "success": True,
            "bookingId": new_order.pickupid,
            "message": "Booking created successfully!"
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ---------------------- RUN APP ----------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("✅ Database tables checked or created successfully!")
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port, debug=True)
