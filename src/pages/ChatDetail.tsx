import { useParams } from "react-router-dom";
import { UserProfile, ChatMessage } from "@/types";
import ChatHeader from "@/components/chats/ChatHeader";
import MessageBubble from "@/components/chats/MessageBubble";
import MessageInput from "@/components/chats/MessageInput";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { Loader2 } from "lucide-react";

const fetchChatData = async (currentUserId?: string, otherUserId?: string) => {
  if (!currentUserId || !otherUserId) throw new Error("User IDs are required");

  // 1. Fetch the other user's profile
  const { data: otherUser, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', otherUserId)
    .single();
  if (profileError) throw new Error("Could not find user.");

  // 2. Find the match record
  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('id')
    .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${currentUserId})`)
    .single();
  if (matchError || !match) throw new Error("Match not found.");

  // 3. Fetch initial messages
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', match.id)
    .order('created_at', { ascending: true });
  if (messagesError) throw new Error("Could not fetch messages.");

  return { otherUser: otherUser as UserProfile, matchId: match.id, messages: messages as ChatMessage[] };
};

const ChatDetail = () => {
  const { chatId: otherUserId } = useParams<{ chatId: string }>();
  const { user: currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['chat', currentUser?.id, otherUserId],
    queryFn: () => fetchChatData(currentUser?.id, otherUserId),
    enabled: !!currentUser && !!otherUserId,
    onSuccess: (data) => {
      setMessages(data.messages);
    }
  });

  useEffect(() => {
    if (!data?.matchId) return;

    const channel = supabase
      .channel(`chat:${data.matchId}`)
      .on<ChatMessage>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${data.matchId}` },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [data?.matchId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!currentUser || !data?.matchId) return;

    const newMessage = {
      match_id: data.matchId,
      sender_id: currentUser.id,
      content: text,
    };

    const { error } = await supabase.from('messages').insert(newMessage);
    if (error) {
      console.error("Error sending message:", error);
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (error || !data) {
    return <div className="flex h-screen items-center justify-center">Could not load chat.</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader user={data.otherUser} />
      <main className="flex-grow pt-16 pb-20">
        <div className="container mx-auto p-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isCurrentUser={msg.sender_id === currentUser?.id}
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