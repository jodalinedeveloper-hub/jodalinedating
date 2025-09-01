import { useParams } from "react-router-dom";
import { UserProfile, ChatMessage } from "@/types";
import ChatHeader from "@/components/chats/ChatHeader";
import MessageBubble from "@/components/chats/MessageBubble";
import MessageInput from "@/components/chats/MessageInput";
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { Loader2 } from "lucide-react";
import { showError } from "@/utils/toast";

interface ChatData {
  otherUser: UserProfile;
  matchId: number;
  messages: ChatMessage[];
}

const fetchChatData = async (currentUserId?: string, otherUserId?: string): Promise<ChatData> => {
  if (!currentUserId || !otherUserId) throw new Error("User IDs are required");

  const { data: otherUser, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', otherUserId)
    .single();
  if (profileError) throw new Error("Could not find user.");

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .select('id')
    .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${otherUserId}),and(user1_id.eq.${otherUserId},user2_id.eq.${currentUserId})`)
    .single();
  if (matchError || !match) throw new Error("Match not found.");

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
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const queryKey = ['chat', currentUser?.id, otherUserId];

  const { data, isLoading, error } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchChatData(currentUser?.id, otherUserId),
    enabled: !!currentUser && !!otherUserId,
  });

  const messages = data?.messages ?? [];

  useEffect(() => {
    if (!data?.matchId || !currentUser) return;

    const channel = supabase
      .channel(`chat:${data.matchId}`)
      .on<ChatMessage>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${data.matchId}` },
        (payload) => {
          if (payload.new.sender_id !== currentUser.id) {
            queryClient.setQueryData<ChatData>(queryKey, (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                messages: [...oldData.messages, payload.new],
              };
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [data?.matchId, currentUser, queryClient, queryKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!currentUser || !data) return;

    const optimisticMessage: ChatMessage = {
      id: Date.now(),
      match_id: data.matchId,
      sender_id: currentUser.id,
      content: text,
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    queryClient.setQueryData<ChatData>(queryKey, (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        messages: [...oldData.messages, optimisticMessage],
      };
    });

    const { error } = await supabase.from('messages').insert({
      match_id: data.matchId,
      sender_id: currentUser.id,
      content: text,
    });

    if (error) {
      showError("Failed to send message. Please try again.");
      // Revert optimistic update
      queryClient.setQueryData<ChatData>(queryKey, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          messages: oldData.messages.filter(m => m.id !== optimisticMessage.id),
        };
      });
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