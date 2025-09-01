import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tighter text-primary">
            Jodaline
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;