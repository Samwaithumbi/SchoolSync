import { courses } from "@/lib/data"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { BookOpen, Plus, Edit, Trash2, Calendar, Users } from "lucide-react"

export default async function Page() {

  const courses = await prisma.course.findMany({
    include: {
      assignments: {
        select: {
          id: true,
          status: true
        }
      }
    }
  })

  const getCourseStats = (course: typeof courses[0]) => {
    const total = course.assignments.length
    const submitted = course.assignments.filter(a => a.status === 'submitted').length
    const inProgress = course.assignments.filter(a => a.status === 'in_progress').length
    const pending = course.assignments.filter(a => a.status === 'pending').length
    
    return { total, submitted, inProgress, pending }
  }

  const getCourseColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500'
    ]
    return colors[index % colors.length]
  }

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

      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No courses yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Get started by adding your first course
          </p>
          <Link href="/courses/new">
            <button className="btn-primary px-6 py-2 rounded-lg">
              Create Course
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const stats = getCourseStats(course)
            const colorClass = getCourseColor(index)
            
            return (
              <div
                key={course.id}
                className="card-hover bg-card rounded-xl p-6 border shadow-sm"
              >
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {course.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {stats.total} assignments
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium text-foreground">
                      {stats.total > 0 ? Math.round((stats.submitted / stats.total) * 100) : 0}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.total > 0 ? (stats.submitted / stats.total) * 100 : 0}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="text-sm font-medium text-blue-800">{stats.pending}</div>
                      <div className="text-xs text-blue-600">Pending</div>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                      <div className="text-sm font-medium text-purple-800">{stats.inProgress}</div>
                      <div className="text-xs text-purple-600">In Progress</div>
                    </div>
                    <div className="p-2 rounded-lg bg-green-50 border border-green-200">
                      <div className="text-sm font-medium text-green-800">{stats.submitted}</div>
                      <div className="text-xs text-green-600">Submitted</div>
                    </div>
                  </div>
                </div>

                {/* Course Actions */}
                <div className="mt-4 pt-4 border-t">
                  <Link 
                    href={`/courses/${course.id}/assignments`}
                    className="btn-secondary w-full py-2 rounded-lg text-sm flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View Assignments</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary Stats */}
      {courses.length > 0 && (
        <div className="bg-card rounded-xl p-6 border shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Course Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <div className="text-2xl font-bold text-foreground">{courses.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Total Courses</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <div className="text-2xl font-bold text-foreground">
                {courses.reduce((sum, course) => sum + course.assignments.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Total Assignments</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <div className="text-2xl font-bold text-foreground">
                {courses.reduce((sum, course) => 
                  sum + course.assignments.filter(a => a.status === 'submitted').length, 0
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Completed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <div className="text-2xl font-bold text-foreground">
                {courses.reduce((sum, course) => 
                  sum + course.assignments.filter(a => a.status === 'in_progress').length, 0
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">In Progress</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}