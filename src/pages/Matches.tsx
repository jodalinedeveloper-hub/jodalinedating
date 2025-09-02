import MatchCard from "@/components/matches/MatchCard";
import { Match, UserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { HeartCrack } from "lucide-react";
import { ViewProfileSheet } from "@/components/profile/ViewProfileSheet";
import ProfileCardSkeleton from "@/components/skeletons/ProfileCardSkeleton";
import EmptyState from "@/components/common/EmptyState";

const fetchMatches = async (userId: string | undefined): Promise<Match[]> => {
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
  const combinedMatches = matchesData.map(match => {
    const otherUserId = match.user1_id === userId ? match.user2_id : match.user1_id;
    return {
      ...match,
      other_user: profilesMap.get(otherUserId) as UserProfile,
    };
  }).filter(match => match.other_user);

  return combinedMatches as Match[];
};

const Matches = () => {
  const { user } = useAuth();
  const { data: matches, isLoading } = useQuery({
    queryKey: ['matches', user?.id],
    queryFn: () => fetchMatches(user?.id),
    enabled: !!user,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Matches</h1>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProfileCardSkeleton key={index} />
          ))}
        </div>
      ) : matches && matches.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {matches.map((match) => (
            <ViewProfileSheet key={match.id} user={match.other_user}>
              <MatchCard user={match.other_user} />
            </ViewProfileSheet>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={HeartCrack}
          title="No matches yet"
          description="You haven't matched with anyone yet. Keep swiping to find your connection!"
          action={{ label: "Start Swiping", to: "/explore" }}
        />
      )}
    </div>
  );
};

export default Matches;