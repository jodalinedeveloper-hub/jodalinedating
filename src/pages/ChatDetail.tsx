import { useParams } from "react-router-dom";
import { ChatConversation, ChatMessage } from "@/types";
import ChatHeader from "@/components/chats/ChatHeader";
import MessageBubble from "@/components/chats/MessageBubble";
import MessageInput from "@/components/chats/MessageInput";
import { useState, useEffect, useRef } from "react";

// Mock data - in a real app, this would come from an API
const mockChats: ChatConversation[] = [
  {
    id: "2",
    user: { id: "2", name: "Anna", age: 26, bio: "", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"], interests: [] },
    messages: [
      { id: "msg1a", text: "Hey! How's it going?", timestamp: "2023-10-27T10:00:00Z", senderId: "2" },
      { id: "msg1b", text: "Not too bad, just chilling. You?", timestamp: "2023-10-27T10:01:00Z", senderId: "current_user" },
      { id: "msg1c", text: "Same here! Did you see that new movie?", timestamp: "2023-10-27T10:01:30Z", senderId: "2" },
    ],
  },
  {
    id: "3",
    user: { id: "3", name: "Maria", age: 29, bio: "", photos: ["https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"], interests: [] },
    messages: [
      { id: "msg2a", text: "I had a great time last night!", timestamp: "2023-10-27T09:30:00Z", senderId: "current_user" },
      { id: "msg2b", text: "Me too! We should do it again sometime.", timestamp: "2023-10-27T09:31:00Z", senderId: "3" },
    ],
  },
  {
    id: "4",
    user: { id: "4", name: "Sophie", age: 25, bio: "", photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop"], interests: [] },
    messages: [
      { id: "msg3a", text: "Are we still on for Friday?", timestamp: "2023-10-26T18:15:00Z", senderId: "4" },
    ],
  },
];

const ChatDetail = () => {
  const { chatId } = useParams();
  const chat = mockChats.find((c) => c.id === chatId);
  const [messages, setMessages] = useState<ChatMessage[]>(chat?.messages || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chat) {
    return <div>Chat not found</div>;
  }

  const handleSendMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: `msg${Date.now()}`,
      text,
      timestamp: new Date().toISOString(),
      senderId: "current_user",
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader userName={chat.user.name} userAvatar={chat.user.photos[0]} />
      <main className="flex-grow pt-16 pb-20">
        <div className="container mx-auto p-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isCurrentUser={msg.senderId === "current_user"}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatDetail;