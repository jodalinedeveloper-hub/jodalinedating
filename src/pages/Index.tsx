import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <Heart className="w-16 h-16 text-primary" />
          <h1 className="text-6xl font-bold tracking-tighter text-primary">
            Jodaline
          </h1>
        </div>
        <p className="text-xl text-muted-foreground">
          Find your connection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="/signup">Sign Up</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;