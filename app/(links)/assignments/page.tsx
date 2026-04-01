// app/(links)/assignments/page.tsx
import { prisma } from "@/lib/prisma"
import FilterAssignment from "@/components/assignments/filterAssignments"
import AssignmentsClient from "@/components/assignments/assignmentsClient"
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

  const statusFilter   = status   && status   !== "all" ? (status   as Status)   : undefined
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

  const allAssignments: AssignmentWithCourse[] = await prisma.assignment.findMany({
    include: { course: true },
  })

  const courses: Course[] = await prisma.course.findMany()

  const isFiltered = !!(
    query ||
    (course    && course    !== "all") ||
    (status    && status    !== "all") ||
    (priority  && priority  !== "all")
  )

  return (
    <div className="space-y-6">
      {/* Filters stay server-rendered so the URL-based filtering still works */}
      <div className="bg-card rounded-xl p-6 border shadow-sm">
        <FilterAssignment courses={courses} />
      </div>

      {/* Everything interactive lives in the client component */}
      <AssignmentsClient
        assignments={assignments}
        allAssignments={allAssignments}
        courses={courses}
        isFiltered={isFiltered}
      />
    </div>
  )
}