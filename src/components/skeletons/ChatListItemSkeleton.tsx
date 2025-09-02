import { Skeleton } from "@/components/ui/skeleton";

const ChatListItemSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-2">
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="flex-grow space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};

export default ChatListItemSkeleton;