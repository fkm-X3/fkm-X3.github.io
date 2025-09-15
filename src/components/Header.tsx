import { Search, User, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <h1 className="text-2xl font-bold text-primary">StreamFlix</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Home</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">Movies</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">TV Shows</a>
            <a href="#" className="text-foreground/80 hover:text-foreground transition-colors">My List</a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search videos..." 
              className="pl-10 w-64 bg-secondary border-border"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => window.open("https://github.com", "_blank")}
          >
            <Github className="w-4 h-4" />
            Repository
          </Button>
          <Button variant="ghost" size="sm">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;