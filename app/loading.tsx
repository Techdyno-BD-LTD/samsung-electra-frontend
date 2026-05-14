import Skeleton from "@/components/common/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 space-y-12 animate-in fade-in duration-500">
      {/* Very Simple, General Shimmer Layout */}
      <div className="space-y-6">
        <Skeleton className="h-16 w-1/2 rounded-2xl" />
        <Skeleton className="h-4 w-1/3 rounded-xl" />
      </div>

      <Skeleton className="h-[500px] w-full rounded-[2.5rem]" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-80 w-full rounded-3xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-1/4 rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-3xl" />
      </div>
    </div>
  );
}