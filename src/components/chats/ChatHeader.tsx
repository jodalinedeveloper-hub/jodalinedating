import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ChatHeaderProps {
  userName: string;
  userAvatar: string;
}

const ChatHeader = ({ userName, userAvatar }: ChatHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b z-10 flex items-center h-16 px-4 gap-4">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <Avatar>
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <h2 className="font-semibold text-lg">{userName}</h2>
    </header>
  );
};

export default ChatHeader;