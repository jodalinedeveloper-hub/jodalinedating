import { UserProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface MatchCardProps {
  user: UserProfile;
}

const MatchCard = ({ user }: MatchCardProps) => {
  const photoUrl = user.photo_urls?.[0];

  return (
    <div className="block cursor-pointer group">
      <Card className="overflow-hidden relative aspect-[3/4] transition-all duration-300 group-hover:scale-105">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={user.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <User className="w-1/2 h-1/2 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <CardContent className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-bold text-lg truncate">{user.username}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchCard;