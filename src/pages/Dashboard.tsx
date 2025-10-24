import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatButton from "@/components/AIChatButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { orderService, userService } from "@/services/api";
import {
  Package,
  Calendar,
  User,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("bookings");
  const navigate = useNavigate();

  const menuItems = [
    { id: "bookings", label: "My Bookings", icon: Package },
    { id: "services", label: "Active Services", icon: Calendar },
    { id: "profile", label: "Profile Details", icon: User },
  ];

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
  });

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getAllOrders,
  });

  const isLoading = profileLoading || bookingsLoading;
  const userName = profile?.name || "User";
  const userEmail = profile?.email || "user@email.com";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/5">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* User Profile Card */}
        <Card className="p-8 mb-8 shadow-soft">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4 bg-gradient-to-br from-primary to-secondary">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-2xl">
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold mb-1">{userName}</h2>
            <p className="text-muted-foreground">{userEmail}</p>
          </div>

          <div className="mt-8 space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start text-lg py-6 ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90"
                    : ""
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary via-primary/95 to-secondary rounded-3xl p-8 mb-8 shadow-elegant text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {userName.split(' ')[0]}!
          </h1>
          <p className="text-white/90 text-lg">
            Manage your garbage collection services and bookings
          </p>
        </div>

        {/* Main Content */}
        <div>
          {activeSection === "bookings" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Booking History</h2>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => navigate("/booking")}
                >
                  Book New Pickup
                </Button>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Loading bookings...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">No bookings yet</p>
                  </Card>
                ) : (
                  bookings.map((booking) => (
                  <Card key={booking.id} className="p-6 shadow-soft hover:shadow-elegant transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-primary">
                            {booking.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              booking.status === "Completed"
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary/20 text-secondary"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{booking.time}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                          <span>{booking.address}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <p className="font-bold text-lg">{booking.service}</p>
                        <Button 
                          variant="outline" 
                          className="border-primary text-primary hover:bg-primary hover:text-white"
                          onClick={() => navigate(`/order/${booking.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSection === "services" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Active Services</h2>
              <Card className="p-8 shadow-soft">
                <div className="space-y-6">
                  <div className="flex justify-between items-start pb-6 border-b">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
                      <p className="text-muted-foreground">Daily pickups at your doorstep</p>
                    </div>
                    <span className="px-4 py-2 bg-primary/10 text-primary font-semibold rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-between items-center p-4 bg-secondary/5 rounded-lg">
                      <span className="text-muted-foreground font-medium">Next Pickup:</span>
                      <span className="font-bold">Tomorrow, 8:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-secondary/5 rounded-lg">
                      <span className="text-muted-foreground font-medium">Monthly Cost:</span>
                      <span className="font-bold">₹499</span>
                    </div>
                  </div>

                  <Button className="w-full py-6 text-lg">Reschedule Pickup</Button>
                </div>
              </Card>
            </div>
          )}

          {activeSection === "profile" && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Profile Details</h2>
              <Card className="p-8 shadow-soft">
                <div className="space-y-6">
                  {profileLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                          <p className="text-lg font-semibold">{profile?.name}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                          <p className="text-lg font-semibold">{profile?.email}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                          <p className="text-lg font-semibold">{profile?.phone}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">City</label>
                          <p className="text-lg font-semibold">{profile?.city}</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-lg font-semibold">{profile?.address}</p>
                      </div>
                    </>
                  )}

                  <Button className="w-full py-6 text-lg mt-6">Edit Profile</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AIChatButton />
    </div>
  );
};

export default Dashboard;
