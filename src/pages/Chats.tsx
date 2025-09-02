import ChatListItem from "@/components/chats/ChatListItem";
import { Match, UserProfile } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { MessageSquareOff } from "lucide-react";
import { useEffect } from "react";
import ChatListItemSkeleton from "@/components/skeletons/ChatListItemSkeleton";
import EmptyState from "@/components/common/EmptyState";

const fetchMatchesForChat = async (userId: string | undefined): Promise<Match[]> => {
  if (!userId) return [];

  const { data: matchesData, error: matchesError } = await supabase
    .from('matches_with_last_message')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .order('last_message_created_at', { ascending: false, nullsFirst: false });

  if (matchesError) {
    console.error("Error fetching matches:", matchesError);
    return [];
  }

  const otherUserIds = matchesData.map(match => 
    match.user1_id === userId ? match.user2_id : match.user1_id
  );

  if (otherUserIds.length === 0) return [];

  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', otherUserIds);

  if (profilesError) {
    console.error("Error fetching matched profiles:", profilesError);
    return [];
  }

  const profilesMap = new Map(profilesData.map(p => [p.id, p]));
  const combinedMatches = matchesData.map(match => ({
    ...match,
    other_user: profilesMap.get(match.user1_id === userId ? match.user2_id : match.user1_id) as UserProfile,
  })).filter(match => match.other_user);

  return combinedMatches as Match[];
};

const Chats = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats', user?.id],
    queryFn: () => fetchMatchesForChat(user?.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chats', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Chats</h1>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <ChatListItemSkeleton key={index} />
          ))}
        </div>
      ) : chats && chats.length > 0 ? (
        <div className="space-y-2">
          {chats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={MessageSquareOff}
          title="No active chats"
          description="When you match with someone, your conversation will appear here."
          action={{ label: "See Your Matches", to: "/matches" }}
        />
      )}
    </div>
  );
};

export default Chats;