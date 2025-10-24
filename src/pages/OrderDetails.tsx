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
  Calendar,
  Clock,
  Package,
  Car,
  ArrowLeft,
  Loader2,
  Star,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.getOrderById(orderId!),
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

  if (error || !order) {
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
                Pickup Details
              </h1>
              <p className="text-white/90 text-lg">ID: {order.pickupId}</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-300" />
              <span className="text-2xl font-bold">
                {order.pickupRating > 0 ? order.pickupRating.toFixed(1) : "Not Rated"}
              </span>
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        <Card className="p-8 mb-6 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Pickup Information</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg">
              <Package className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-muted-foreground font-medium">Waste Type</p>
                <p className="text-lg font-semibold">{order.wasteType}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-muted-foreground font-medium">Pickup Date</p>
                <p className="text-lg font-semibold">{order.pickupDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg">
              <Clock className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-muted-foreground font-medium">Pickup Time</p>
                <p className="text-lg font-semibold">{order.pickupTime}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
              <div className="flex-1">
                <p className="text-muted-foreground font-medium">Pickup Location</p>
                <p className="text-lg font-semibold">{order.userLocation}</p>
              </div>
            </div>

            {order.notes && (
              <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg">
                <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-muted-foreground font-medium">Additional Notes</p>
                  <p className="text-lg font-semibold">{order.notes}</p>
                </div>
              </div>
            )}

            {order.photoFilename && (
              <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg">
                <ImageIcon className="h-5 w-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-muted-foreground font-medium">Photo Attached</p>
                  <p className="text-sm text-muted-foreground">{order.photoFilename}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Cost Information */}
        <Card className="p-8 mb-6 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Cost Details</h2>
          </div>

          <div className="flex justify-between items-center p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20">
            <span className="text-xl font-bold">Estimated Cost</span>
            <span className="text-3xl font-bold text-primary">{order.cost}</span>
          </div>
        </Card>

        {/* User & Driver IDs (for reference) */}
        <Card className="p-8 shadow-soft">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Reference Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/5 rounded-lg">
              <p className="text-muted-foreground font-medium mb-1">User ID</p>
              <p className="text-lg font-semibold">{order.userId}</p>
            </div>

            <div className="p-4 bg-secondary/5 rounded-lg">
              <p className="text-muted-foreground font-medium mb-1">Driver ID</p>
              <p className="text-lg font-semibold">{order.driverId}</p>
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