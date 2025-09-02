import { UserProfile } from "@/types";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { calculateAge } from "@/lib/utils";

interface DiscoverProfileCardProps {
  user: UserProfile;
}

const DiscoverProfileCard = ({ user }: DiscoverProfileCardProps) => {
  const photoUrl = user.photo_urls?.[0];
  const age = calculateAge(user.date_of_birth);

  return (
    <div className="block cursor-pointer group">
      <Card className="overflow-hidden rounded-lg">
        <div className="relative aspect-[3/4] transition-all duration-300 group-hover:scale-105">
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
        </div>
      </Card>
      <div className="pt-2">
        <p className="font-semibold truncate">{user.username}{age > 0 && `, ${age}`}</p>
      </div>
    </div>
  );
};

export default DiscoverProfileCard;