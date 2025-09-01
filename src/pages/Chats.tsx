import ChatListItem from "@/components/chats/ChatListItem";
import { Match, UserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { Loader2 } from "lucide-react";

const fetchMatchesForChat = async (userId: string | undefined): Promise<Match[]> => {
  if (!userId) return [];

  const { data: matchesData, error: matchesError } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

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
  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats', user?.id],
    queryFn: () => fetchMatchesForChat(user?.id),
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Chats</h1>
      {chats && chats.length > 0 ? (
        <div className="space-y-2">
          {chats.map((chat) => (
            <ChatListItem key={chat.id} chat={chat} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">You have no active chats. Get a match to start talking!</p>
      )}
    </div>
  );
};

export default Chats;