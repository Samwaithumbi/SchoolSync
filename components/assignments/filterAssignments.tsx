"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Course } from "@/lib/types"

interface Props {
  courses: Course[]
}

export default function FilterAssignment({ courses }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === "all" || value === "") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams]
  )

  const hasActiveFilters =
    searchParams.get("query") ||
    searchParams.get("course") ||
    searchParams.get("status") ||
    searchParams.get("priority")

  return (
    <section
      aria-label="Filter assignments"
      className="flex flex-wrap gap-3 md:flex-row md:items-center"
    >
      {isPending && (
        <div className="w-full text-xs text-muted-foreground mb-1 animate-pulse">
          Updating results...
        </div>
      )}

      {/* Search */}
      <div className="relative w-full md:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          defaultValue={searchParams.get("query") ?? ""}
          onChange={(e) => updateFilter("query", e.target.value)}
          placeholder="Search assignment"
          className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Course */}
      <select
        defaultValue={searchParams.get("course") ?? "all"}
        onChange={(e) => updateFilter("course", e.target.value)}
        className="w-full md:w-auto rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="all">All Courses</option>
        {courses.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Status — values must match the DB enum: in_progress not in-progress */}
      <select
        defaultValue={searchParams.get("status") ?? "all"}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="w-full md:w-auto rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="submitted">Submitted</option>
      </select>

      {/* Priority */}
      <select
        defaultValue={searchParams.get("priority") ?? "all"}
        onChange={(e) => updateFilter("priority", e.target.value)}
        className="w-full md:w-auto rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Clear — only visible when a filter is active */}
      {hasActiveFilters && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm text-muted-foreground underline hover:text-foreground transition-colors"
        >
          Clear filters
        </button>
      )}
    </section>
  )
}