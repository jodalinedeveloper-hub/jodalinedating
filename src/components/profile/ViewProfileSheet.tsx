import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { UserProfile } from "@/types";
import { calculateAge } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { User } from "lucide-react";

interface ViewProfileSheetProps {
  user: UserProfile;
  children: React.ReactNode;
}

export const ViewProfileSheet = ({ user, children }: ViewProfileSheetProps) => {
  const age = calculateAge(user.date_of_birth);

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl">{user.username}{age > 0 && `, ${age}`}</SheetTitle>
          {user.location && <SheetDescription>{user.location}</SheetDescription>}
        </SheetHeader>
        <div className="py-6 space-y-6">
          {user.photo_urls && user.photo_urls.length > 0 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {user.photo_urls.map((url, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square w-full overflow-hidden rounded-lg">
                      <img src={url} alt={`Profile photo ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {user.photo_urls.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          ) : (
            <div className="aspect-square w-full bg-muted flex items-center justify-center rounded-lg">
              <User className="w-1/2 h-1/2 text-muted-foreground" />
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2 text-lg">About Me</h3>
            <p className="text-muted-foreground">{user.bio || "No bio yet."}</p>
          </div>

          {user.lifestyle_tags && user.lifestyle_tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 text-lg">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.lifestyle_tags.map((interest) => (
                  <Badge key={interest} variant="secondary">{interest}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button asChild className="w-full">
            <Link to={`/chats/${user.id}`}>Send a Message</Link>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};