import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AssignmentsPage({ params }: PageProps) {
  const user = await currentUser()
  if (!user) {
    return <div>Please sign in to view assignments.</div>
  }

  const { id } = await params
  const courseId = Number(id)

  // Verify course belongs to user
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      userId: user.id,
    },
    include: {
      assignments: {
        orderBy: {
          dueDate: "asc",
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {course.name} Assignments
          </h1>
          <p className="text-muted-foreground mt-1">
            {course.assignments.length} assignment{course.assignments.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {course.assignments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No assignments yet for this course.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {course.assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-card rounded-lg p-4 border shadow-sm"
            >
              <h3 className="font-semibold text-foreground">
                {assignment.title}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <span className={`px-2 py-1 text-xs rounded-full border ${
                  assignment.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    : assignment.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {assignment.status.replace('_', ' ')}
                </span>
                <span className="text-sm text-muted-foreground">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}