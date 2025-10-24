import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatButton from "@/components/AIChatButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Clean India, Green India
              <span className="block text-primary">One Pickup at a Time</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Book garbage pickup instantly — just like ordering food online!
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 shadow-hover hover:scale-105 transition-transform"
              onClick={() => navigate("/booking")}
            >
              Book a Pickup Now
            </Button>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Book Anytime, Anywhere</h3>
                <p className="text-muted-foreground">
                  Schedule pickups with just a few taps. Available 24/7 across India.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Eco-Friendly Disposal</h3>
                <p className="text-muted-foreground">
                  Proper waste segregation and recycling for a cleaner environment.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-hover transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/10">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Trusted by Municipal Partners</h3>
                <p className="text-muted-foreground">
                  Direct coordination with local authorities for reliable service.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-hero text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make India Cleaner?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of citizens contributing to a greener tomorrow
          </p>
          <Button 
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
            onClick={() => navigate("/services")}
          >
            View Our Plans
          </Button>
        </div>
      </section>

      <Footer />
      <AIChatButton />
    </div>
  );
};

export default Index;
