import { NavLink } from "react-router-dom";
import { LayoutGrid, Heart, MessageSquare, Star } from "lucide-react";

const navItems = [
  { to: "/explore", icon: LayoutGrid, label: "Explore" },
  { to: "/matches", icon: Heart, label: "Matches" },
  { to: "/chats", icon: MessageSquare, label: "Chats" },
  { to: "/premium", icon: Star, label: "Premium" },
];

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-md transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;