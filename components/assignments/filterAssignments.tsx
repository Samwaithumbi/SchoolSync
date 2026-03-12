"use client"

import { Search } from "lucide-react"
import { useState } from "react"

type Filters = {
  query: string
  course: string
  status: string
  priority: string
}

export default function FilterAssignment() {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    course: "all",
    status: "all",
    priority: "all",
  })

  function updateFilter<K extends keyof Filters>(
    key: K,
    value: Filters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <section
      aria-label="Filter assignments"
      className="flex  flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center"
    >
      {/* Search */}
      <div className="relative w-full md:max-w-xs">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          type="text"
          value={filters.query}
          onChange={(e) => updateFilter("query", e.target.value)}
          placeholder="Search assignment"
          className=" rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Course */}
      <select
        value={filters.course}
        onChange={(e) => updateFilter("course", e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="all">All Courses</option>
        <option value="it">IT</option>
        <option value="computer-science">Computer Science</option>
        <option value="web-dev">Web Development</option>
      </select>

      {/* Status */}
      <select
        value={filters.status}
        onChange={(e) => updateFilter("status", e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="submitted">Submitted</option>
      </select>

      {/* Priority */}
      <select
        value={filters.priority}
        onChange={(e) => updateFilter("priority", e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </section>
  )
}