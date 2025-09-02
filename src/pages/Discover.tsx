import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { UserProfile } from "@/types";
import { SearchX } from "lucide-react";
import { ViewProfileSheet } from "@/components/profile/ViewProfileSheet";
import DiscoverProfileCard from "@/components/discover/DiscoverProfileCard";
import ProfileCardSkeleton from "@/components/skeletons/ProfileCardSkeleton";
import EmptyState from "@/components/common/EmptyState";

const fetchAllProfiles = async (userId: string | undefined): Promise<UserProfile[]> => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .not('id', 'eq', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
    return [];
  }

  return data as UserProfile[];
};

const Discover = () => {
  const { user } = useAuth();
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['allProfiles', user?.id],
    queryFn: () => fetchAllProfiles(user?.id),
    enabled: !!user,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Discover</h1>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProfileCardSkeleton key={index} />
          ))}
        </div>
      ) : profiles && profiles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
          {profiles.map((profile) => (
            <ViewProfileSheet key={profile.id} user={profile}>
              <DiscoverProfileCard user={profile} />
            </ViewProfileSheet>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No one new to see"
          description="It looks like there are no other users on the platform right now. Check back later!"
        />
      )}
    </div>
  );
};

export default Discover;