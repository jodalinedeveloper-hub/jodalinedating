import MatchCard from "@/components/matches/MatchCard";
import { Match, UserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { Loader2 } from "lucide-react";

const fetchMatches = async (userId: string | undefined): Promise<Match[]> => {
  if (!userId) return [];

  // 1. Fetch all match records for the current user
  const { data: matchesData, error: matchesError } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);

  if (matchesError) {
    console.error("Error fetching matches:", matchesError);
    return [];
  }

  // 2. Get the IDs of the other users in the matches
  const otherUserIds = matchesData.map(match => 
    match.user1_id === userId ? match.user2_id : match.user1_id
  );

  if (otherUserIds.length === 0) return [];

  // 3. Fetch the profiles of all the other users
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', otherUserIds);

  if (profilesError) {
    console.error("Error fetching matched profiles:", profilesError);
    return [];
  }

  // 4. Combine the match data with the profile data
  const profilesMap = new Map(profilesData.map(p => [p.id, p]));
  const combinedMatches = matchesData.map(match => {
    const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
    return {
      ...match,
      other_user: profilesMap.get(otherUserId) as UserProfile,
    };
  }).filter(match => match.other_user); // Filter out any potential mismatches

  return combinedMatches as Match[];
};

const Matches = () => {
  const { user } = useAuth();
  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches', user?.id],
    queryFn: () => fetchMatches(user?.id),
    enabled: !!user,
  });

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Matches</h1>
      {matches && matches.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {matches.map((match) => (
            <MatchCard key={match.id} user={match.other_user} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">You have no matches yet. Keep swiping!</p>
      )}
    </div>
  );
};

export default Matches;