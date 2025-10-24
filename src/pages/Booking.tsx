import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { bookingService } from "@/services/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Upload, Clock, DollarSign, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Booking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wasteType, setWasteType] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const wasteTypes = [
    "General Waste",
    "Organic/Food Waste",
    "Recyclable Waste",
    "Electronic Waste",
    "Construction Debris",
    "Hazardous Waste",
  ];

  const pickupTimes = [
    "ASAP - within 30 mins",
    "Within 1 hour",
    "Within 2 hours",
    "Schedule for later today",
    "Schedule for tomorrow",
  ];

  const calculateEstimatedCost = () => {
    if (!wasteType) return "Select waste type first";
    const basePrices: { [key: string]: number } = {
      "General Waste": 50,
      "Organic/Food Waste": 40,
      "Recyclable Waste": 30,
      "Electronic Waste": 80,
      "Construction Debris": 150,
      "Hazardous Waste": 200,
    };
    return `₹${basePrices[wasteType] || 50}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
      toast({
        title: "Photo uploaded",
        description: "AI will help identify your waste type",
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress(`${position.coords.latitude}, ${position.coords.longitude}`);
          toast({
            title: "Location detected",
            description: "Using your current location",
          });
        },
        () => {
          toast({
            title: "Location error",
            description: "Could not get your location",
            variant: "destructive",
          });
        }
      );
    }
  };

  const createBookingMutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (data) => {
      toast({
        title: "Pickup scheduled!",
        description: `Booking ID: ${data.bookingId}`,
      });
      
      // Reset form
      setWasteType("");
      setAddress("");
      setPickupTime("");
      setNotes("");
      setPhoto(null);
      
      // Reset file input
      const fileInput = document.getElementById("photo-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      setTimeout(() => navigate("/dashboard"), 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!wasteType || !address || !pickupTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      wasteType,
      address,
      pickupTime,
      notes: notes.trim() || undefined,
      photo: photo ?? undefined,
    };

    console.log("Submitting booking:", bookingData);
    createBookingMutation.mutate(bookingData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Schedule a Pickup</h1>
            <p className="text-xl text-muted-foreground">
              Tell us what you need picked up
            </p>
          </div>

          <Card className="p-8 shadow-soft">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Waste Type */}
              <div>
                <Label htmlFor="waste-type" className="text-base font-semibold mb-2">
                  Waste Type <span className="text-destructive">*</span>
                </Label>
                <Select value={wasteType} onValueChange={setWasteType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Photo Upload */}
              <div>
                <Label className="text-base font-semibold mb-2">
                  Upload Photo (Optional)
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="photo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-muted-foreground">
                        AI will identify your waste type
                      </p>
                    </div>
                    {photo && (
                      <p className="text-sm text-primary font-medium">
                        {photo.name}
                      </p>
                    )}
                  </label>
                </div>
              </div>

              {/* Pickup Address */}
              <div>
                <Label htmlFor="address" className="text-base font-semibold mb-2">
                  Pickup Address <span className="text-destructive">*</span>
                </Label>
                <div className="space-y-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleUseCurrentLocation}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current Location
                  </Button>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes" className="text-base font-semibold mb-2">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions for the collector..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Pickup Time */}
              <div>
                <Label htmlFor="pickup-time" className="text-base font-semibold mb-2">
                  Pickup Time <span className="text-destructive">*</span>
                </Label>
                <Select value={pickupTime} onValueChange={setPickupTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select pickup time">
                      {pickupTime && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {pickupTime}
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {pickupTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estimated Cost */}
              <Card className="p-4 bg-accent/20 border-accent/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Estimated Cost</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {calculateEstimatedCost()}
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg py-6 shadow-hover hover:scale-105 transition-transform"
                disabled={createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Scheduling...
                  </>
                ) : (
                  "Confirm Pickup"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Booking;