import MatchCard from "@/components/matches/MatchCard";
import { UserProfile } from "@/types";

const mockMatches: UserProfile[] = [
  { id: "2", name: "Anna", age: 26, bio: "", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"], interests: [] },
  { id: "3", name: "Maria", age: 29, bio: "", photos: ["https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"], interests: [] },
  { id: "4", name: "Sophie", age: 25, bio: "", photos: ["https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop"], interests: [] },
  { id: "5", name: "Chloe", age: 30, bio: "", photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"], interests: [] },
  { id: "6", name: "Emily", age: 27, bio: "", photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop"], interests: [] },
  { id: "7", name: "Olivia", age: 24, bio: "", photos: ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"], interests: [] },
];

const Matches = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Matches</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {mockMatches.map((user) => (
          <MatchCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Matches;