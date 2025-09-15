import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent z-10" />
      
      <div className="relative z-20 container mx-auto px-4 max-w-2xl">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Watch
            <span className="text-primary block">Amazing Content</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg">
            Enjoy our curated video collection. All videos are hosted directly from the repository for seamless streaming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90">
              <Play className="w-5 h-5" />
              Watch Now
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Info className="w-5 h-5" />
              About Series
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;