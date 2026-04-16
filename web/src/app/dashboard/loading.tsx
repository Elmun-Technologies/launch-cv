export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      <div className="soha-skeleton h-8 w-48" />
      <div className="soha-skeleton h-4 w-64" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5">
            <div className="soha-skeleton h-10 w-10 rounded-lg" />
            <div className="soha-skeleton mt-4 h-8 w-20" />
            <div className="soha-skeleton mt-2 h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="soha-skeleton h-5 w-40" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="soha-skeleton-row">
              <div className="soha-skeleton soha-skeleton-avatar" />
              <div className="flex-1 space-y-2">
                <div className="soha-skeleton soha-skeleton-title" />
                <div className="soha-skeleton soha-skeleton-text w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
