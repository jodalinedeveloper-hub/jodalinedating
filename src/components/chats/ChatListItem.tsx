import { Match } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface ChatListItemProps {
  chat: Match;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
  return (
    <Link to={`/chats/${chat.other_user.id}`} className="block">
      <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors">
        <Avatar className="w-14 h-14">
          <AvatarImage src={chat.other_user.photo_urls[0]} alt={chat.other_user.username} />
          <AvatarFallback>{chat.other_user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold truncate">{chat.other_user.username}</h3>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            Start the conversation!
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChatListItem;