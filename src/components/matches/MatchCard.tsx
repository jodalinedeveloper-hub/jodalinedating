import { UserProfile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface MatchCardProps {
  user: UserProfile;
}

const MatchCard = ({ user }: MatchCardProps) => {
  return (
    <Link to={`/chats/${user.id}`} className="block group">
      <Card className="overflow-hidden relative aspect-[3/4] transition-all duration-300 group-hover:scale-105">
        <img
          src={user.photos[0]}
          alt={user.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <CardContent className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white font-bold text-lg truncate">{user.name}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MatchCard;