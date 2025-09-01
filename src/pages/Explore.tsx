import ProfileCard from "@/components/explore/ProfileCard";
import SuggestedRow from "@/components/explore/SuggestedRow";
import { UserProfile } from "@/types";

const mockUser: UserProfile = {
  id: "1",
  name: "Jessica",
  age: 28,
  bio: "Lover of adventure, dogs, and spontaneous weekend trips. Looking for someone to share tacos and laughter with.",
  photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop"],
  interests: ["Hiking", "Photography", "Cooking"],
};

const mockSuggestions: UserProfile[] = [
  { id: "2", name: "Anna", age: 26, bio: "", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"], interests: [] },
  { id: "3", name: "Maria", age: 29, bio: "", photos: ["https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"], interests: [] },
  { id: "4", name: "Sophie", age: 25, bio: "", photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop"], interests: [] },
  { id: "5", name: "Chloe", age: 30, bio: "", photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"], interests: [] },
];


const Explore = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <ProfileCard user={mockUser} />
      <SuggestedRow users={mockSuggestions} />
    </div>
  );
};

export default Explore;