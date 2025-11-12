import { Link2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-primary p-2.5 rounded-lg shadow-glow">
                <Link2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                UTM Builder
              </h1>
              <p className="text-xs text-muted-foreground">Campaign Link Generator</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#builder" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Builder
            </a>
            <a href="#guide" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Guide
            </a>
            <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Features
            </a>
          </nav>

          {/* CTA Button */}
          <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 border-0">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
