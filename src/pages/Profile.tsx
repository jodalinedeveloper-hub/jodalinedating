import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { EditProfileSheet } from "@/components/profile/EditProfileSheet";
import { useProfile } from "@/hooks/use-profile";

const Profile = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading, refetch } = useProfile();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError(error.message);
    } else {
      navigate("/login");
    }
  };

  if (isLoading || !profile) {
    return <div className="container mx-auto p-4 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-6">
      <Card>
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
            <AvatarImage src={profile.photo_urls?.[0]} alt={profile.username} />
            <AvatarFallback>{profile.username?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{profile.username}</CardTitle>
          <p className="text-muted-foreground">@{profile.username}</p>
          <div className="pt-4">
            <EditProfileSheet profile={profile} onUpdate={refetch} />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {profile.photo_urls && profile.photo_urls.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-center">Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {profile.photo_urls.map((url, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img src={url} alt={`Profile photo ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="font-semibold mb-2 text-center">About Me</h3>
            <p className="text-muted-foreground text-center">{profile.bio || "No bio yet."}</p>
          </div>
          {profile.lifestyle_tags && profile.lifestyle_tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-center">Interests</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {profile.lifestyle_tags.map((interest) => (
                  <span key={interest} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button onClick={handleLogout} variant="destructive" className="w-full">
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
      </Button>
    </div>
  );
};

export default Profile;