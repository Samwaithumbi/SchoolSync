// app/(links)/assignments/page.tsx
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import FilterAssignment from "@/components/assignments/filterAssignments"
import { Plus, Calendar, Clock, CheckCircle, Target, Edit, Trash2 } from "lucide-react"
import { AssignmentWithCourse, Course, Status, Priority } from "@/lib/types"

interface PageProps {
  searchParams: Promise<{
    query?: string
    course?: string
    status?: string
    priority?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const { query, course, status, priority } = await searchParams

  // Cast string params to their strict enum types so Prisma accepts them
  const statusFilter = status && status !== "all" ? (status as Status) : undefined
  const priorityFilter = priority && priority !== "all" ? (priority as Priority) : undefined

  const assignments: AssignmentWithCourse[] = await prisma.assignment.findMany({
    where: {
      ...(statusFilter   && { status: statusFilter }),
      ...(priorityFilter && { priority: priorityFilter }),
      ...(course && course !== "all" && { course: { name: course } }),
      ...(query  && { title: { contains: query, mode: "insensitive" } }),
    },
    include: { course: true },
    orderBy: { dueDate: "asc" },
  })

  // Separate unfiltered query so stats always show totals, not filtered counts
  const allAssignments: AssignmentWithCourse[] = await prisma.assignment.findMany({
    include: { course: true },
  })

  const courses: Course[] = await prisma.course.findMany()

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "pending":     return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200"
      case "submitted":   return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "pending":     return <Clock className="w-4 h-4" />
      case "in_progress": return <Target className="w-4 h-4" />
      case "submitted":   return <CheckCircle className="w-4 h-4" />
    }
  }

  // Fix 3: accept Date (what Prisma returns), not string
  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 0) return "bg-red-50 text-red-700 border-red-200"
    if (days <= 2) return "bg-orange-50 text-orange-700 border-orange-200"
    if (days <= 7) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-gray-50 text-gray-700 border-gray-200"
  }

  const groupedAssignments = assignments.reduce<Record<string, AssignmentWithCourse[]>>(
    (acc, assignment) => {
      if (!acc[assignment.status]) acc[assignment.status] = []
      acc[assignment.status].push(assignment)
      return acc
    },
    {}
  )

  const isFiltered = !!(
    query ||
    (course && course !== "all") ||
    (status && status !== "all") ||
    (priority && priority !== "all")
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground mt-1">Track and manage all your coursework</p>
        </div>
        <Link href="/assignments/new-assignment">
          <button className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </Link>
      </div>

      {/* Quick Stats — always uses allAssignments so counts are never affected by filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["pending", "in_progress", "submitted"] as Status[]).map((s) => {
          const count = allAssignments.filter((a) => a.status === s).length
          const Icon = s === "pending" ? Target : s === "in_progress" ? Clock : CheckCircle
          const bgColor =
            s === "pending"     ? "bg-yellow-100" :
            s === "in_progress" ? "bg-blue-100"   : "bg-green-100"
          const textLabel = s.replace("_", " ").replace(/^\w/, (c) => c.toUpperCase())
          return (
            <div key={s} className="bg-card rounded-xl p-4 border shadow-sm flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${bgColor}`}>
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{count}</div>
                <p className="text-sm text-muted-foreground">{textLabel}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-6 border shadow-sm">
        <FilterAssignment courses={courses} />
      </div>

      {/* Assignment List */}
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isFiltered ? "No assignments match your filters" : "No assignments yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {isFiltered
              ? "Try adjusting your filters"
              : "Create your first assignment to get started"}
          </p>
          {!isFiltered && (
            <Link href="/assignments/new-assignment">
              <button className="btn-primary px-6 py-2 rounded-lg">Create Assignment</button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {(["pending", "in_progress", "submitted"] as Status[]).map((s) => {
            const statusAssignments = groupedAssignments[s] || []
            if (statusAssignments.length === 0) return null

            return (
              <div key={s} className="bg-card rounded-xl border shadow-sm">
                <div className="p-6 border-b flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      s === "pending"     ? "bg-yellow-100" :
                      s === "in_progress" ? "bg-blue-100"   : "bg-green-100"
                    }`}
                  >
                    {getStatusIcon(s)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground capitalize">
                      {s.replace("_", " ")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {statusAssignments.length} assignment{statusAssignments.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="divide-y">
                  {statusAssignments.map((assignment) => {
                    const daysUntil = getDaysUntilDue(assignment.dueDate)
                    return (
                      <div
                        key={assignment.id}
                        className="p-6 hover:bg-accent/50 transition-colors flex justify-between items-start"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-medium text-foreground truncate">{assignment.title}</h4>
                            <span
                              className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(assignment.status)}`}
                            >
                              {assignment.status.replace("_", " ")}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{assignment.course.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              {/* Fix 3: call .toLocaleDateString() directly on the Date object */}
                              <span>Due {assignment.dueDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <div
                            className={`px-3 py-1 rounded-full border text-sm font-medium ${getUrgencyColor(daysUntil)}`}
                          >
                            {daysUntil <= 0
                              ? "Overdue"
                              : daysUntil === 1
                              ? "Tomorrow"
                              : `${daysUntil} days`}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Link href={`/assignments/${assignment.id}/edit`}>
                              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                            </Link>
                            <button className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}