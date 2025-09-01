import { UserProfile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SuggestedRowProps {
  users: UserProfile[];
}

const SuggestedRow = ({ users }: SuggestedRowProps) => {
  return (
    <div className="w-full max-w-sm mx-auto mt-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-2">
        Suggested for you
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2 px-2 -mx-2">
        {users.map((user) => (
          <div key={user.id} className="flex flex-col items-center gap-1">
            <Avatar className="w-16 h-16 border-2 border-primary/50">
              <AvatarImage src={user.photos[0]} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedRow;