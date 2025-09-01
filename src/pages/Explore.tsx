import ProfileCard from "@/components/explore/ProfileCard";
import { UserProfile } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { Loader2 } from "lucide-react";
import { MatchNotification } from "@/components/explore/MatchNotification";
import { showError } from "@/utils/toast";

const PAGE_SIZE = 5;

const fetchProfiles = async (userId: string, pageParam: number) => {
  const { data: swipedUsers, error: swipedError } = await supabase
    .from('swipes')
    .select('swiped_id')
    .eq('swiper_id', userId);

  if (swipedError) throw swipedError;
  const swipedIds = swipedUsers.map(swipe => swipe.swiped_id);

  const from = pageParam * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('profiles')
    .select('*')
    .not('id', 'eq', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (swipedIds.length > 0) {
    query = query.not('id', 'in', `(${swipedIds.join(',')})`);
  }

  const { data: profiles, error: profilesError } = await query;
  if (profilesError) throw profilesError;

  return profiles as UserProfile[];
};

const Explore = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [visibleUsers, setVisibleUsers] = useState<UserProfile[]>([]);
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['profiles', user?.id],
    queryFn: ({ pageParam = 0 }) => fetchProfiles(user!.id, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
    enabled: !!user,
  });

  const allUsers = useMemo(() => data?.pages.flat() ?? [], [data]);

  useEffect(() => {
    setVisibleUsers(allUsers);
  }, [allUsers]);

  useEffect(() => {
    if (visibleUsers.length > 0 && visibleUsers.length < 3 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [visibleUsers.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('realtime-profiles')
      .on<UserProfile>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'profiles' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['profiles', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const handleSwipe = async (swipedUser: UserProfile, action: 'left' | 'right' | 'super') => {
    if (!user) return;
    setVisibleUsers((prev) => prev.filter(u => u.id !== swipedUser.id));

    const direction = action === 'right' || action === 'super' ? 'like' : 'pass';
    if (direction === 'like') {
      const { data, error } = await supabase.rpc('handle_like', { swiped_user_id: swipedUser.id });
      if (error) showError("Something went wrong. Please try again.");
      if (data?.is_match) {
        setMatchedUser(swipedUser);
        setIsMatchModalOpen(true);
        queryClient.invalidateQueries({ queryKey: ['matches', user.id] });
        queryClient.invalidateQueries({ queryKey: ['chats', user.id] });
      }
    } else {
      await supabase.from('swipes').insert({ swiper_id: user.id, swiped_id: swipedUser.id, action: 'pass' });
    }
  };

  const currentUser = visibleUsers[visibleUsers.length - 1];
  const showEmptyState = !isLoading && !currentUser && !isFetchingNextPage;

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
        ) : visibleUsers.length > 0 ? (
          visibleUsers.map((userProfile, index) => (
            <ProfileCard
              key={userProfile.id}
              user={userProfile}
              onSwipe={(action) => handleSwipe(userProfile, action)}
              isActive={index === visibleUsers.length - 1}
            />
          ))
        ) : null}
        {showEmptyState && (
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