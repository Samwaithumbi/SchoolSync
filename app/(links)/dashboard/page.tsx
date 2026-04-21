import Stats from "@/components/dashboard/stats"
import {  getUpcomingAssignments } from "@/lib/data"
import { prisma } from "@/lib/prisma"
import { Calendar, CheckCircle, AlertCircle, TrendingUp, BookOpen, Target, Award } from "lucide-react"
import {  currentUser } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"

type DashboardCard = {
  id: number
  label: string
  value: number
  icon: React.ReactNode
  color: string
  trend?: string
}

export default async function Page() {
  const user = await currentUser()
  console.log(user?.firstName)
  
  const upcomingAssignments = getUpcomingAssignments()
  

  const assignments = await prisma.assignment.findMany({
    include: {
      course: true
    },
    orderBy: {
      dueDate: 'asc'
    }
  })

  console.log("Fetched assignments:", assignments)

  // Replace the getDashboardStats() call with this
const stats = {
  total: assignments.length,
  pending: assignments.filter(a => a.status === 'pending').length,
  inProgress: assignments.filter(a => a.status === 'in_progress').length,
  submitted: assignments.filter(a => a.status === 'submitted').length,
}

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    timeZone: "Africa/Nairobi",
  })
 

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'submitted': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
    if (days <= 2) return 'text-red-600 bg-red-50 border-red-200'
    if (days <= 7) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.firstName ?? "Student"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">{date}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span>Productivity up 23%</span>
          </div>
        </div>
      </header>

        {/* Stats Cards */}
       <div>
        <Stats stats={stats}/>
       </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <section className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Deadlines
            </h2>
            <span className="text-sm text-muted-foreground">
              {assignments.filter(a => a.status !== 'submitted').length} active
            </span>
          </div>

          {assignments.filter(a => a.status !== 'submitted').length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-muted-foreground">
                No upcoming deadlines 
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments
                .filter(a => a.status !== 'submitted')
                .slice(0, 5)
                .map((assignment) => {
                  const daysUntil = getDaysUntilDue(assignment.dueDate)
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {assignment.title}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {assignment.course.name}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(assignment.status)}`}>
                            {assignment.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getUrgencyColor(daysUntil)}`}>
                        {daysUntil <= 0 ? 'Overdue' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </section>

        {/* Recent Submissions */}
        <section className="bg-card rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Recent Submissions
            </h2>
            <span className="text-sm text-muted-foreground">
              {assignments.filter(a => a.status === 'submitted').length} completed
            </span>
          </div>

          {assignments.filter(a => a.status === 'submitted').length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-muted-foreground">
                No submissions yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Start working on your assignments!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments
                .filter(a => a.status === 'submitted')
                .slice(0, 5)
                .map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {assignment.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {assignment.course.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium">Submitted</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>

      {/* Quick Stats */}
      <section className="bg-card rounded-xl p-6 border shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">Performance Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-accent/50">
            <div className="text-2xl font-bold text-foreground">
              {Math.round((stats.submitted / stats.total) * 100)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-accent/50">
            <div className="text-2xl font-bold text-foreground">
              {assignments.filter(a => a.status === 'in_progress').length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Currently Working</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-accent/50">
            <div className="text-2xl font-bold text-foreground">
              {assignments.filter(a => {
                const days = getDaysUntilDue(a.dueDate)
                return days <= 7 && a.status !== 'submitted'
              }).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Due This Week</p>
          </div>
        </div>
      </section>
    </div>
  )
}