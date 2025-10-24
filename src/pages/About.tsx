import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatButton from "@/components/AIChatButton";
import { Card } from "@/components/ui/card";
import { Users, TrendingUp, Award, Leaf, Zap, Shield, MapPin, Target } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, number: "50,000+", label: "Happy Customers" },
    { icon: TrendingUp, number: "2M+", label: "Pickups Completed" },
    { icon: Award, number: "25+", label: "Cities Covered" },
  ];

  const benefits = [
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Proper waste segregation and environmentally responsible disposal methods.",
    },
    {
      icon: Zap,
      title: "Convenient",
      description: "Book pickups anytime through our app or website with flexible scheduling.",
    },
    {
      icon: Shield,
      title: "Reliable",
      description: "Professional service with timely pickups and dedicated customer support.",
    },
    {
      icon: MapPin,
      title: "Wide Coverage",
      description: "Available in 25+ major cities across India with expanding coverage.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-br from-background to-secondary/5">
        {/* Hero Section */}
        <section className="py-16 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            About Cleanzy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Making cities cleaner, one household at a time
          </p>
        </section>

        {/* Mission Section */}
        <section className="py-8 container mx-auto px-4">
          <Card className="p-8 md:p-12 shadow-elegant">
            <div className="flex items-start gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl flex-shrink-0">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              </div>
            </div>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
              <p>
                Cleanzy was founded with a simple yet powerful vision: to revolutionize garbage collection in
                India. We noticed that traditional waste management systems often fail to meet the needs of
                modern households and businesses. That's why we created a platform that brings convenience,
                reliability, and environmental responsibility to waste management.
              </p>
              
              <p>
                Just like how food delivery apps transformed how we order meals, we're transforming garbage collection.
                Our on-demand service allows you to schedule pickups at your convenience, whether it's daily, weekly,
                or for special events.
              </p>
              
              <p className="font-semibold text-foreground">
                We act as a bridge between citizens and municipal corporations, ensuring that waste is collected efficiently
                and disposed of responsibly. Our team works closely with local authorities to maintain the highest
                standards of waste management and environmental protection.
              </p>
            </div>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="py-12 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-8 text-center shadow-soft hover:shadow-elegant transition-all">
                <div className="inline-flex p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 container mx-auto px-4 pb-16">
          <div className="bg-gradient-to-br from-primary via-primary/95 to-secondary rounded-3xl p-8 md:p-12 shadow-elegant">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Why Choose Us?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <benefit.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                    <p className="text-white/90 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIChatButton />
    </div>
  );
};

export default About;
