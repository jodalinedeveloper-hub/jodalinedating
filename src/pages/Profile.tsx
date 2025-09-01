import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

// Mock user data - in a real app, this would come from your auth state or API
const mockUser = {
  name: "Alex Doe",
  username: "alex_doe",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto-format&fit=crop",
  bio: "Lover of adventure, dogs, and spontaneous weekend trips. Looking for someone to share tacos and laughter with.",
  interests: ["Hiking", "Photography", "Cooking", "Travel", "Music"],
};

const Profile = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
            <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
            <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{mockUser.name}</CardTitle>
          <p className="text-muted-foreground">@{mockUser.username}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="font-semibold mb-2">About Me</h3>
            <p className="text-muted-foreground">{mockUser.bio}</p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold mb-2">Interests</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {mockUser.interests.map((interest) => (
                <span key={interest} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;