import FilterAssignment from "@/components/assignments/filterAssignments"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus, Calendar, Clock, CheckCircle, Target, Edit, Trash2, AlertCircle } from "lucide-react"
import { courses } from "@/lib/data"

export default async function Page() {
  const assignments = await prisma.assignment.findMany({
    include: {
      course: true
    },
    orderBy: {
      dueDate: 'asc'
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'submitted': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'in_progress': return <Target className="w-4 h-4" />
      case 'submitted': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 0) return 'bg-red-50 text-red-700 border-red-200'
    if (days <= 2) return 'bg-orange-50 text-orange-700 border-orange-200'
    if (days <= 7) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const groupedAssignments = assignments.reduce((acc, assignment) => {
    const status = assignment.status
    if (!acc[status]) acc[status] = []
    acc[status].push(assignment)
    return acc
  }, {} as Record<string, typeof assignments>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center gap-4 md:gap-6 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Assignments
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all your coursework
          </p>
        </div>
        <Link href="/assignments/new-assignment">
          <button className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {assignments.filter(a => a.status === 'pending').length}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {assignments.filter(a => a.status === 'in_progress').length}
              </div>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {assignments.filter(a => a.status === 'submitted').length}
              </div>
              <p className="text-sm text-muted-foreground">Submitted</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl p-4 border shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {assignments.filter(a => getDaysUntilDue(a.dueDate) <= 3 && a.status !== 'submitted').length}
              </div>
              <p className="text-sm text-muted-foreground">Due Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-6 border shadow-sm">
        <FilterAssignment courses={courses}/>
      </div>

      {/* Assignment List */}
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No assignments yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Create your first assignment to get started
          </p>
          <Link href="/assignments/new">
            <button className="btn-primary px-6 py-2 rounded-lg">
              Create Assignment
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {(['pending', 'in_progress', 'submitted'] as const).map((status) => {
            const statusAssignments = groupedAssignments[status] || []
            if (statusAssignments.length === 0) return null

            return (
              <div key={status} className="bg-card rounded-xl border shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      status === 'pending' ? 'bg-yellow-100' :
                      status === 'in_progress' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {getStatusIcon(status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground capitalize">
                        {status.replace('_', ' ')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {statusAssignments.length} assignment{statusAssignments.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="divide-y">
                  {statusAssignments.map((assignment) => {
                    const daysUntil = getDaysUntilDue(assignment.dueDate)
                    return (
                      <div
                        key={assignment.id}
                        className="p-6 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-medium text-foreground truncate">
                                {assignment.title}
                              </h4>
                              <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(assignment.status)}`}>
                                {assignment.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{assignment.course.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>Due {new Date(assignment.dueDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getUrgencyColor(daysUntil)}`}>
                              {daysUntil <= 0 ? 'Overdue' : 
                               daysUntil === 1 ? 'Tomorrow' : 
                               daysUntil <= 7 ? `${daysUntil} days` : 
                               `${daysUntil} days`}
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