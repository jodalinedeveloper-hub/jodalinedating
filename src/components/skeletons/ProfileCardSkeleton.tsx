import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const ProfileCardSkeleton = () => {
  return (
    <div className="space-y-2">
      <Card className="overflow-hidden rounded-lg">
        <Skeleton className="aspect-[3/4] w-full" />
      </Card>
      <Skeleton className="h-5 w-3/4" />
    </div>
  );
};

export default ProfileCardSkeleton;