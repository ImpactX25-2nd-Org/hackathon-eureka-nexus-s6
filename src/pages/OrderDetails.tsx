import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatButton from "@/components/AIChatButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/api";
import { useEffect } from "react";
import {
  MapPin,
  Phone,
  User,
  CreditCard,
  Calendar,
  Clock,
  Package,
  Car,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: orderDetails, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrderDetails(orderId!),
    enabled: !!orderId,
  });

  // Show error toast only when error changes
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/5">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer />
        <AIChatButton />
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/5">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-destructive mb-4">Failed to load order details</p>
            <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
          </div>
        </main>
        <Footer />
        <AIChatButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/5">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-primary/95 to-secondary rounded-3xl p-8 mb-8 shadow-elegant text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Order Details
              </h1>
              <p className="text-white/90 text-lg">{orderDetails.id}</p>
            </div>
            <span
              className={`px-6 py-3 rounded-full text-lg font-semibold ${
                orderDetails.status === "Completed"
                  ? "bg-white/20 text-white"
                  : "bg-white/30 text-white"
              }`}
            >
              {orderDetails.status}
            </span>
          </div>
        </div>

        {/* Driver Information */}
        <Card className="p-8 mb-6 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Driver Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-5 w-5" />
                <span className="font-medium">Driver Name</span>
              </div>
              <p className="text-xl font-semibold ml-7">{orderDetails.driver.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-5 w-5" />
                <span className="font-medium">Phone Number</span>
              </div>
              <p className="text-xl font-semibold ml-7">{orderDetails.driver.phone}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Car className="h-5 w-5" />
                <span className="font-medium">Vehicle Plate Number</span>
              </div>
              <p className="text-xl font-semibold ml-7">{orderDetails.driver.plateNo}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="font-medium">Current Location</span>
              </div>
              <p className="text-xl font-semibold ml-7">{orderDetails.driver.location}</p>
            </div>
          </div>
        </Card>

        {/* Booking Details */}
        <Card className="p-8 mb-6 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Booking Details</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-muted-foreground font-medium">Date & Time</p>
                <p className="text-lg font-semibold">
                  {orderDetails.date} at {orderDetails.time}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-muted-foreground font-medium">Pickup Address</p>
                <p className="text-lg font-semibold">{orderDetails.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg">
              <Package className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-muted-foreground font-medium">Service Type</p>
                <p className="text-lg font-semibold">{orderDetails.service}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Details */}
        <Card className="p-8 mb-6 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Payment Details</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-secondary/5 rounded-lg">
              <span className="text-muted-foreground font-medium">Customer Name</span>
              <span className="text-lg font-semibold">{orderDetails.customer.name}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-secondary/5 rounded-lg">
              <span className="text-muted-foreground font-medium">Email</span>
              <span className="text-lg font-semibold">{orderDetails.customer.email}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-secondary/5 rounded-lg">
              <span className="text-muted-foreground font-medium">Phone</span>
              <span className="text-lg font-semibold">{orderDetails.customer.phone}</span>
            </div>

            <div className="h-px bg-border my-4"></div>

            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
              <span className="text-muted-foreground font-medium">Payment Method</span>
              <span className="text-lg font-semibold">{orderDetails.payment.method}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
              <span className="text-muted-foreground font-medium">Transaction ID</span>
              <span className="text-lg font-semibold">{orderDetails.payment.transactionId}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg">
              <span className="text-muted-foreground font-medium">Payment Status</span>
              <span className="px-4 py-2 bg-primary/20 text-primary font-semibold rounded-full">
                {orderDetails.payment.status}
              </span>
            </div>

            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20">
              <span className="text-xl font-bold">Total Amount</span>
              <span className="text-3xl font-bold text-primary">{orderDetails.payment.amount}</span>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
      <AIChatButton />
    </div>
  );
};

export default OrderDetails;
