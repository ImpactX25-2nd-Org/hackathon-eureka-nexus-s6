import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatButton from "@/components/AIChatButton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Calendar,
  Recycle,
  Check,
  Sparkles,
  Clock,
  Building2,
  Siren,
} from "lucide-react";

const Services = () => {
  const pricingPlans = [
    {
      name: "Pay Per Day",
      price: "₹29",
      period: "/day",
      description: "Flexible daily pickup without commitment",
      icon: Clock,
      features: [
        "No subscription needed",
        "Pay only when you need",
        "Book via app anytime",
        "Residential waste only",
        "Next-day pickup",
      ],
      cta: "Book Now",
      highlight: false,
    },
    {
      name: "Premium Monthly",
      price: "₹499",
      period: "/month",
      description: "Best value for households",
      icon: Home,
      features: [
        "Daily scheduled pickups",
        "Save ₹370/month vs per-day",
        "Priority customer support",
        "Eco-friendly disposal",
        "Mobile app access",
        "Waste segregation guide",
      ],
      cta: "Subscribe Now",
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "Gold Monthly",
      price: "₹899",
      period: "/month",
      description: "Perfect for events & bulk waste",
      icon: Calendar,
      features: [
        "Everything in Premium",
        "Event waste management",
        "Bulk cleanup service",
        "Same-day emergency pickup",
        "Dedicated support line",
        "Monthly recycling reports",
      ],
      cta: "Subscribe Now",
      highlight: false,
    },
    {
      name: "Platinum Monthly",
      price: "₹1,499",
      period: "/month",
      description: "Ultimate waste solution",
      icon: Sparkles,
      features: [
        "Everything in Gold",
        "Unlimited on-demand pickups",
        "24/7 priority support",
        "Commercial waste handling",
        "Dedicated account manager",
        "Carbon credit tracking",
        "Annual discount included",
      ],
      cta: "Subscribe Now",
      highlight: false,
    },
  ];

  const eventServices = [
    {
      icon: Calendar,
      title: "Event-Only Pickup",
      price: "Starting ₹999",
      description: "One-time waste collection for your special occasions",
      features: [
        "Weddings & receptions",
        "Birthday parties",
        "Corporate events",
        "Festivals & gatherings",
        "Same-day cleanup available",
        "Bulk waste handling",
      ],
    },
  ];

  const comingSoon = [
    {
      icon: Siren,
      title: "Medical Waste Collection",
      status: "Coming Soon",
      description: "Safe disposal of bio-medical waste with certified protocols",
    },
    {
      icon: Building2,
      title: "Industrial Waste Management",
      status: "Coming Soon",
      description: "Large-scale industrial waste handling and compliance solutions",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="gradient-hero text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Services & Pricing
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Choose the perfect plan for your waste management needs
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Flexible Plans for Every Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you need daily service or occasional pickup, we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-6 shadow-soft hover:shadow-hover transition-all relative ${
                  plan.highlight ? "border-2 border-primary scale-105 lg:scale-110" : ""
                }`}
              >
                {plan.badge && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    {plan.badge}
                  </Badge>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <plan.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <Button
                  className="w-full mb-4"
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* Event-Only Services */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Event-Only Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Need waste pickup for a special occasion? We've got you covered.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {eventServices.map((service, index) => (
                <Card key={index} className="p-8 shadow-soft hover:shadow-hover transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-primary/10">
                      <service.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{service.title}</h3>
                        <Badge variant="secondary" className="text-sm">
                          {service.price}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Book Event Pickup</Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Expanding our services to meet all your waste management needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {comingSoon.map((service, index) => (
              <Card
                key={index}
                className="p-8 shadow-soft relative overflow-hidden opacity-75"
              >
                <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                  {service.status}
                </Badge>
                <div className="flex items-start gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <service.icon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="bg-muted/50 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose Cleanzy?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We bridge the gap between you and municipal services, ensuring your waste
              is collected efficiently even when regular services fail.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Cities Covered</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">99%</div>
                <p className="text-muted-foreground">On-Time Pickup Rate</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIChatButton />
    </div>
  );
};

export default Services;
