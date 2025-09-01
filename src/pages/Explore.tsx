import ProfileCard from "@/components/explore/ProfileCard";
import { UserProfile } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { Loader2 } from "lucide-react";
import { MatchNotification } from "@/components/explore/MatchNotification";
import { showError } from "@/utils/toast";

const fetchProfiles = async (userId: string | undefined) => {
  if (!userId) return [];

  // 1. Get IDs of users the current user has already swiped on
  const { data: swipedUsers, error: swipedError } = await supabase
    .from('swipes')
    .select('swiped_id')
    .eq('swiper_id', userId);

  if (swipedError) {
    console.error("Error fetching swiped users:", swipedError);
    return [];
  }
  const swipedIds = swipedUsers.map(swipe => swipe.swiped_id);

  // 2. Fetch profiles, excluding self and already swiped users
  let query = supabase
    .from('profiles')
    .select('*')
    .not('id', 'eq', userId)
    .order('created_at', { ascending: false }) // Prioritize new users
    .limit(10);

  // Only add the 'not in' filter if there are swiped IDs to exclude
  if (swipedIds.length > 0) {
    query = query.not('id', 'in', `(${swipedIds.join(',')})`);
  }

  const { data: profiles, error: profilesError } = await query;

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return [];
  }

  return profiles as UserProfile[];
};

const Explore = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const { isLoading, refetch } = useQuery({
    queryKey: ['profiles', user?.id],
    queryFn: () => fetchProfiles(user?.id),
    enabled: !!user,
    onSuccess: (data) => {
      setUsers(data);
    }
  });

  const handleSwipe = async (swipedUser: UserProfile, action: 'left' | 'right' | 'super') => {
    if (!user) return;

    const direction = action === 'right' || action === 'super' ? 'like' : 'pass';
    
    setUsers((prev) => prev.filter(u => u.id !== swipedUser.id));

    if (direction === 'like') {
      const { data, error } = await supabase.rpc('handle_like', { swiped_user_id: swipedUser.id });
      if (error) {
        showError("Something went wrong. Please try again.");
        console.error(error);
      }
      if (data?.is_match) {
        setMatchedUser(swipedUser);
        setIsMatchModalOpen(true);
        // When a match occurs, invalidate queries for matches and chats to force a refresh
        queryClient.invalidateQueries({ queryKey: ['matches', user.id] });
        queryClient.invalidateQueries({ queryKey: ['chats', user.id] });
      }
    } else { // 'pass'
      await supabase.from('swipes').insert({ swiper_id: user.id, swiped_id: swipedUser.id, action: 'pass' });
    }
  };

  const currentUser = users[users.length - 1];

  return (
    <div className="container mx-auto p-4 flex flex-col items-center h-full">
      <MatchNotification 
        open={isMatchModalOpen}
        onOpenChange={setIsMatchModalOpen}
        matchedUser={matchedUser}
      />
      <div className="relative flex-grow flex items-center justify-center w-full max-w-sm aspect-[9/14]">
        {isLoading ? (
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        ) : currentUser ? (
          users.map((userProfile, index) => (
            <ProfileCard
              key={userProfile.id}
              user={userProfile}
              onSwipe={(action) => handleSwipe(userProfile, action)}
              isActive={index === users.length - 1}
            />
          ))
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-muted-foreground">No more profiles</h2>
            <p className="text-muted-foreground mt-2">Check back later for new people!</p>
            <Button onClick={() => refetch()} className="mt-4">Refresh</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;