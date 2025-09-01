import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/SessionContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MatchNotificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matchedUser: UserProfile | null;
}

export const MatchNotification = ({ open, onOpenChange, matchedUser }: MatchNotificationProps) => {
  const { user } = useAuth();
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setCurrentUserProfile(data);
      }
    };
    if (open) {
      fetchCurrentUserProfile();
    }
  }, [user, open]);

  if (!currentUserProfile || !matchedUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center items-center">
          <DialogTitle className="text-3xl font-bold text-primary">It's a Match!</DialogTitle>
          <DialogDescription>
            You and {matchedUser.username} have liked each other.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center gap-4 my-6">
          <Avatar className="w-24 h-24 border-4 border-primary">
            <AvatarImage src={currentUserProfile.photo_urls?.[0]} />
            <AvatarFallback>{currentUserProfile.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <Avatar className="w-24 h-24 border-4 border-accent">
            <AvatarImage src={matchedUser.photo_urls?.[0]} />
            <AvatarFallback>{matchedUser.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-4">
          <Button asChild onClick={() => onOpenChange(false)}>
            <Link to={`/chats/${matchedUser.id}`}>Send a Message</Link>
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Keep Swiping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};