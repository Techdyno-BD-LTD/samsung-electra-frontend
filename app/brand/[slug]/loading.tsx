import Skeleton from "@/components/common/Skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white mt-20">
      {/* Banner Shimmer */}
      <section className="mx-auto w-full px-4 pt-4 md:px-0">
        <div className="mx-auto w-full">
          <Skeleton className="w-full aspect-[1840/400] rounded-md" />
        </div>
      </section>

      {/* Breadcrumb Shimmer */}
      <div className="mx-auto w-full max-w-[1840px] px-4 py-6 md:px-8 mt-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 rounded" />
          <div className="h-3 w-3 border-r-2 border-b-2 border-gray-300 transform rotate-45" />
          <Skeleton className="h-4 w-16 rounded" />
          <div className="h-3 w-3 border-r-2 border-b-2 border-gray-300 transform rotate-45" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </div>

      {/* Brand Title Shimmer */}
      <div className="mx-auto w-full max-w-[1840px] px-4 py-2 md:px-8 text-center">
        <Skeleton className="mx-auto h-8 w-48 rounded-md mb-8" />
      </div>

      {/* Category Tab and Product list shimmers */}
      <section className="mx-auto w-full max-w-[1840px] px-4 pb-4 md:px-8">
        <div className="flex gap-2 border-b pb-4 overflow-x-auto scrollbar-none">
          <Skeleton className="h-10 w-24 rounded-full flex-shrink-0" />
          <Skeleton className="h-10 w-24 rounded-full flex-shrink-0" />
          <Skeleton className="h-10 w-24 rounded-full flex-shrink-0" />
          <Skeleton className="h-10 w-24 rounded-full flex-shrink-0" />
        </div>
        
        <div className="mt-8 space-y-12">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border border-gray-100 rounded-2xl p-4 space-y-4">
                  <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
