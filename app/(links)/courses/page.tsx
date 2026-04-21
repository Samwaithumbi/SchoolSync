import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import CourseCard from "@/components/coursecomps/course-card"
import { currentUser } from "@clerk/nextjs/server"

export default async function Page() {
  const user = await currentUser()
  if (!user) {
    return <div>Please sign in to view your courses.</div>
  }

  const courses = await prisma.course.findMany({
    where: {
      userId: user.id
    },
    include: {
      assignments: {
        select: {
          id: true,
          status: true
        }
      }
    }
  })


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center gap-4 md:gap-6 flex flex-col md:flex-row items-center justify-between ">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Courses
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your courses and track assignments
          </p>
        </div>
        <Link href="/courses/new">
          <button className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </Link>
      </div>

     <CourseCard courses={courses}/>
    </div>
  )
}