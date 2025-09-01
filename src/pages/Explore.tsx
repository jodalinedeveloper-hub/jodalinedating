import ProfileCard from "@/components/explore/ProfileCard";
import SuggestedRow from "@/components/explore/SuggestedRow";
import { UserProfile } from "@/types";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const initialUsers: UserProfile[] = [
  { id: "5", name: "Chloe", age: 30, bio: "Traveler at heart. I've been to 20 countries and I'm always planning my next trip.", photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"], interests: [], prompts: [{ question: "I'm looking for...", answer: "Someone to explore new cities with and try new food." }] },
  { id: "4", name: "Sophie", age: 25, bio: "Artist and dreamer. My love language is sharing playlists and weird memes.", photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format=fit-crop"], interests: [], prompts: [{ question: "A hill I will die on is...", answer: "Pineapple absolutely belongs on pizza." }] },
  { id: "3", name: "Maria", age: 29, bio: "Fitness junkie and foodie. I can probably out-lift you and then out-eat you.", photos: ["https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format=fit-crop"], interests: [], prompts: [{ question: "My simple pleasures are...", answer: "A good cup of coffee in the morning and a long run at sunset." }] },
  { id: "2", name: "Anna", age: 26, bio: "Bookworm, coffee enthusiast, and aspiring plant mom. Let's find a cozy cafe.", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto-format=fit=crop"], interests: [], prompts: [{ question: "Two truths and a lie...", answer: "I've read over 100 books this year, I have a pet snake, I've never seen Star Wars." }] },
  { id: "1", name: "Jessica", age: 28, bio: "Lover of adventure, dogs, and spontaneous weekend trips. Looking for someone to share tacos and laughter with.", photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto-format=fit-crop"], interests: ["Hiking", "Photography", "Cooking"], prompts: [{ question: "The way to win me over is...", answer: "With a perfectly curated Spotify playlist and a good sense of humor." }] },
];

const mockSuggestions: UserProfile[] = [
  { id: "6", name: "Emily", age: 27, bio: "", photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format=fit-crop"], interests: [], prompts: [] },
  { id: "7", name: "Olivia", age: 24, bio: "", photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto-format=fit-crop"], interests: [], prompts: [] },
];

const Explore = () => {
  const [users, setUsers] = useState(initialUsers);

  const handleSwipe = (direction: 'left' | 'right' | 'super') => {
    console.log(`Swiped ${direction} on ${users[users.length - 1].name}`);
    // Remove the swiped user from the stack
    setUsers((prev) => prev.slice(0, prev.length - 1));
  };

  const resetDeck = () => {
    setUsers(initialUsers);
  }

  const currentUser = users[users.length - 1];
  const nextUser = users[users.length - 2];

  return (
    <div className="container mx-auto p-4 flex flex-col items-center h-full">
      <div className="relative flex-grow flex items-center justify-center w-full max-w-sm aspect-[9/14]">
        {currentUser ? (
          <>
            {/* Optional: show the next card underneath for a stacking effect */}
            {nextUser && (
              <div className="absolute w-full h-full scale-95 -bottom-4 opacity-75">
                <Card className="w-full h-full mx-auto overflow-hidden shadow-lg bg-gray-200">
                   <img
                      src={nextUser.photos[0]}
                      alt={nextUser.name}
                      className="w-full h-full object-cover"
                    />
                </Card>
              </div>
            )}
            <ProfileCard
              key={currentUser.id}
              user={currentUser}
              onSwipe={handleSwipe}
            />
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-muted-foreground">No more profiles</h2>
            <p className="text-muted-foreground mt-2">Check back later for new people!</p>
            <Button onClick={resetDeck} className="mt-4">Reset Deck</Button>
          </div>
        )}
      </div>
      <SuggestedRow users={mockSuggestions} />
    </div>
  );
};

export default Explore;