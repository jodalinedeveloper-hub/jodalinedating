import { Match } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface ChatListItemProps {
  chat: Match;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
  const photoUrl = chat.other_user.photo_urls?.[0];
  const fallback = chat.other_user.username?.charAt(0) || 'U';

  const lastMessage = chat.last_message_content || "Start the conversation!";
  const timestamp = chat.last_message_created_at
    ? formatDistanceToNow(new Date(chat.last_message_created_at), { addSuffix: true })
    : "";

  return (
    <Link to={`/chats/${chat.other_user.id}`} className="block">
      <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors">
        <Avatar className="w-14 h-14">
          {photoUrl && <AvatarImage src={photoUrl} alt={chat.other_user.username} />}
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
        <div className="flex-grow overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold truncate">{chat.other_user.username}</h3>
            {timestamp && <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{timestamp}</span>}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChatListItem;