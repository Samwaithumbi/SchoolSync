export default function LoadingDashboard() {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
            <div className="h-4 w-48 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="h-8 w-32 rounded-lg bg-muted animate-pulse" />
          </div>
        </header>
  
        {/* Stat Cards Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-xl p-6 border shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-muted animate-pulse" />
                <div className="text-right">
                  <div className="h-6 w-8 rounded bg-muted animate-pulse mb-2" />
                  <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                </div>
              </div>
              <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
  
        {/* Recent Activity & Upcoming Deadlines Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines Skeleton */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded bg-muted animate-pulse" />
                <div className="h-5 w-32 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-4 w-12 rounded bg-muted animate-pulse" />
            </div>
  
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border bg-accent/50"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-16 rounded-full bg-muted animate-pulse" />
                    </div>
                  </div>
                  <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          </section>

          {/* Recent Submissions Skeleton */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded bg-muted animate-pulse" />
                <div className="h-5 w-32 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-4 w-12 rounded bg-muted animate-pulse" />
            </div>
  
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border bg-accent/50"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-20 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="text-right space-y-1">
                    <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                    <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Performance Overview Skeleton */}
        <section className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="h-5 w-32 rounded bg-muted animate-pulse mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center p-4 rounded-lg bg-accent/50">
                <div className="h-8 w-12 mx-auto rounded bg-muted animate-pulse mb-2" />
                <div className="h-4 w-20 mx-auto rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </div>
    )
  }