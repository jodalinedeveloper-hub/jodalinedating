import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SessionContext";
import { UserProfile } from "@/types";
import { Loader2 } from "lucide-react";
import { ViewProfileSheet } from "@/components/profile/ViewProfileSheet";
import DiscoverProfileCard from "@/components/discover/DiscoverProfileCard";

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

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Discover</h1>
      {profiles && profiles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
          {profiles.map((profile) => (
            <ViewProfileSheet key={profile.id} user={profile}>
              <DiscoverProfileCard user={profile} />
            </ViewProfileSheet>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No other users found. Check back later!</p>
      )}
    </div>
  );
};

export default Discover;