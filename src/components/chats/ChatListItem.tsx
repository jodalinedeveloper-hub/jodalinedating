import { ChatConversation } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface ChatListItemProps {
  chat: ChatConversation;
}

const ChatListItem = ({ chat }: ChatListItemProps) => {
  const lastMessage = chat.messages[chat.messages.length - 1];

  return (
    <Link to={`/chats/${chat.id}`} className="block">
      <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors">
        <Avatar className="w-14 h-14">
          <AvatarImage src={chat.user.photos[0]} alt={chat.user.name} />
          <AvatarFallback>{chat.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold truncate">{chat.user.name}</h3>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage.text}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChatListItem;