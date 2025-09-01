import { UserProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, Zap } from "lucide-react";

interface ProfileCardProps {
  user: UserProfile;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden aspect-[9/14] relative shadow-lg">
      <img
        src={user.photos[0]}
        alt={user.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold">
            {user.name}, {user.age}
          </h2>
          <p className="text-base text-gray-200 line-clamp-2">{user.bio}</p>
        </div>
        <div className="flex justify-around items-center mt-6">
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full border-2 border-red-500 text-red-500 bg-white/20 backdrop-blur-sm hover:bg-red-500 hover:text-white"
            onClick={() => console.log("Dislike")}
          >
            <X className="w-8 h-8" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-20 h-20 rounded-full border-2 border-accent text-accent bg-white/20 backdrop-blur-sm hover:bg-accent hover:text-white"
            onClick={() => console.log("Like")}
          >
            <Heart className="w-10 h-10" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full border-2 border-primary text-primary bg-white/20 backdrop-blur-sm hover:bg-primary hover:text-white"
            onClick={() => console.log("Super Like")}
          >
            <Zap className="w-8 h-8" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;