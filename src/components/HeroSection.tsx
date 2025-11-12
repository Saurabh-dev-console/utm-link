import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = () => {
  const scrollToBuilder = () => {
    const builderSection = document.getElementById("builder");
    builderSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-primary/10 border border-primary/20 animate-scale-in">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Free • No Sign-up Required</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          Build Perfect{" "}
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            UTM Links
          </span>
          <br />
          in Seconds
        </h1>

        {/* Description */}
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create properly formatted UTM-tagged URLs for your marketing campaigns. 
          Track traffic sources with Google Analytics effortlessly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            size="lg"
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-base px-8"
            onClick={scrollToBuilder}
          >
            Start Building Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 hover:border-primary hover:text-primary transition-all duration-300"
          >
            Learn More
          </Button>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-4 justify-center pt-8 animate-slide-up">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
            <Shield className="w-4 h-4 text-success" />
            <span className="text-sm font-medium">Secure & Private</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium">Instant Generation</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Track Performance</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
