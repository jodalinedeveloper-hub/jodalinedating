import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { showError } from "@/utils/toast";
import { useEffect, useState } from "react";
import { EditProfileSheet } from "@/components/profile/EditProfileSheet";

interface ProfileData {
  username: string;
  bio: string;
  lifestyle_tags: string[];
  photo_urls: string[];
}

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (user) {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('username, bio, lifestyle_tags, photo_urls')
        .eq('id', user.id)
        .single();

      if (error) {
        showError("Could not fetch profile.");
        console.error(error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      showError(error.message);
    } else {
      navigate("/login");
    }
  };

  if (loading || !profile) {
    return <div className="container mx-auto p-4 text-center">Loading profile...</div>;
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
            <EditProfileSheet profile={profile} onUpdate={fetchProfile} />
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