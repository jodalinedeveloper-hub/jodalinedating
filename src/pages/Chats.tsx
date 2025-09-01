import ChatListItem from "@/components/chats/ChatListItem";
import { ChatConversation } from "@/types";

const mockChats: ChatConversation[] = [
  {
    id: "2",
    user: { id: "2", name: "Anna", age: 26, bio: "", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"], interests: [] },
    messages: [
      { id: "msg1", text: "Hey! How's it going?", timestamp: "2023-10-27T10:00:00Z", senderId: "2" },
    ],
  },
  {
    id: "3",
    user: { id: "3", name: "Maria", age: 29, bio: "", photos: ["https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"], interests: [] },
    messages: [
      { id: "msg2", text: "I had a great time last night!", timestamp: "2023-10-27T09:30:00Z", senderId: "current_user" },
    ],
  },
  {
    id: "4",
    user: { id: "4", name: "Sophie", age: 25, bio: "", photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop"], interests: [] },
    messages: [
      { id: "msg3", text: "Are we still on for Friday?", timestamp: "2023-10-26T18:15:00Z", senderId: "4" },
    ],
  },
];

const Chats = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Chats</h1>
      <div className="space-y-2">
        {mockChats.map((chat) => (
          <ChatListItem key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
};

export default Chats;