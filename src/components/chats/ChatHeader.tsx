import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ViewProfileSheet } from "@/components/profile/ViewProfileSheet";

interface ChatHeaderProps {
  user: UserProfile;
}

const ChatHeader = ({ user }: ChatHeaderProps) => {
  const navigate = useNavigate();
  const photoUrl = user.photo_urls?.[0];
  const fallback = user.username?.charAt(0) || 'U';

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b z-10 flex items-center h-16 px-4 gap-4">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <ViewProfileSheet user={user}>
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar>
            {photoUrl && <AvatarImage src={photoUrl} alt={user.username} />}
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold text-lg">{user.username}</h2>
        </div>
      </ViewProfileSheet>
    </header>
  );
};

export default ChatHeader;