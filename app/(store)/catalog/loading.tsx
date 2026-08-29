export default function CatalogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-[#1A1C2B]" />
        <div className="h-4 w-96 animate-pulse rounded bg-[#1A1C2B]/60" />
        <div className="mt-2 h-12 w-full max-w-2xl animate-pulse rounded-xl bg-[#1A1C2B]" />
      </div>

      {/* Main Layout Skeleton */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-72 shrink-0 rounded-2xl border border-[#2D3349] bg-[#1A1C2B]/80 p-5">
          <div className="h-6 w-24 animate-pulse rounded bg-[#2D3349]" />
          <div className="mt-6 flex flex-col gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-8 w-full animate-pulse rounded-lg bg-[#090B14]/60" />
            ))}
          </div>
          <div className="mt-8 h-24 w-full animate-pulse rounded-lg bg-[#090B14]/60" />
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <div className="h-14 w-full animate-pulse rounded-xl bg-[#1A1C2B]/60" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-xl border border-[#2D3349] bg-[#1A1C2B]"
              >
                <div className="aspect-[16/10] w-full animate-pulse bg-[#0F111A]" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-4 w-20 animate-pulse rounded bg-[#2D3349]" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-[#2D3349]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[#2D3349]/60" />
                </div>
                <div className="h-12 w-full animate-pulse bg-[#131421]/60" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
