"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Calendar, Clock, CheckCircle, Target, Edit, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { createPortal } from "react-dom"
import { AssignmentWithCourse, Course, Status } from "@/lib/types"
import EditAssignmentModal from "@/components/assignments/editAssignmentModal"

interface AssignmentsClientProps {
  assignments: AssignmentWithCourse[]
  allAssignments: AssignmentWithCourse[]
  courses: Course[]
  isFiltered: boolean
}

export default function AssignmentsClient({
  assignments: initial,
  allAssignments,
  courses,
  isFiltered,
}: AssignmentsClientProps) {
  const [assignments, setAssignments] = useState(initial)
  const [editingAssignment, setEditingAssignment] = useState<AssignmentWithCourse | null>(null)
  const [deletingAssignment, setDeletingAssignment] = useState<AssignmentWithCourse | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const diffTime = new Date(dueDate).getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 0) return "bg-red-50 text-red-700 border-red-200"
    if (days <= 2) return "bg-orange-50 text-orange-700 border-orange-200"
    if (days <= 7) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-gray-50 text-gray-700 border-gray-200"
  }

  const groupedAssignments = assignments.reduce<Record<string, AssignmentWithCourse[]>>(
    (acc, a) => {
      if (!acc[a.status]) acc[a.status] = []
      acc[a.status].push(a)
      return acc
    },
    {}
  )

  const handleSave = (updated: AssignmentWithCourse) => {
    setAssignments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  const handleDelete = async () => {
    if (!deletingAssignment) return
    setIsDeleting(true)
    setDeleteError(null)

    try {
      const res = await fetch(`/api/assignments/${deletingAssignment.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message ?? "Failed to delete assignment")
      }

      setAssignments((prev) => prev.filter((a) => a.id !== deletingAssignment.id))
      setDeletingAssignment(null)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsDeleting(false)
    }
  }

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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["pending", "in_progress", "submitted"] as Status[]).map((s) => {
          const count = allAssignments.filter((a) => a.status === s).length
          const Icon = s === "pending" ? Target : s === "in_progress" ? Clock : CheckCircle
          const bgColor =
            s === "pending"     ? "bg-yellow-100" :
            s === "in_progress" ? "bg-blue-100"   : "bg-green-100"
          return (
            <div key={s} className="bg-card rounded-xl p-4 border shadow-sm flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${bgColor}`}>
                <Icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{count}</div>
                <p className="text-sm text-muted-foreground capitalize">{s.replace("_", " ")}</p>
              </div>
            </div>
          )
        })}
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
            {isFiltered ? "Try adjusting your filters" : "Create your first assignment to get started"}
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
                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(assignment.status)}`}>
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
                              <span>Due {new Date(assignment.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getUrgencyColor(daysUntil)}`}>
                            {daysUntil <= 0 ? "Overdue" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setEditingAssignment(assignment)}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setDeleteError(null); setDeletingAssignment(assignment) }}
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            >
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

      {/* Edit Modal */}
      <EditAssignmentModal
        assignment={editingAssignment}
        courses={courses}
        isOpen={!!editingAssignment}
        onClose={() => setEditingAssignment(null)}
        onSave={handleSave}
      />

      {/* Delete Confirm Modal */}
      {deletingAssignment && typeof window !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) setDeletingAssignment(null) }}
        >
          <div className="bg-card w-full max-w-md rounded-2xl border shadow-xl p-6 space-y-4">

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Delete Assignment</h2>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-foreground">
              Are you sure you want to delete{" "}
              <span className="font-medium">&quot;{deletingAssignment.title}&quot;</span>?
            </p>

            {deleteError && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">
                {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingAssignment(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg border text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium flex items-center gap-2 hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}