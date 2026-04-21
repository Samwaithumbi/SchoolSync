"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Calendar, BookOpen, Edit, Trash2, X, AlertTriangle, Loader2 } from "lucide-react"

type Course = {
  id: number
  name: string
  assignments: { id: number; status: string }[]
}

type Props = {
  courses: Course[]
}

export default function CourseCard({ courses }: Props) {
  const router = useRouter()
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<Course | null>(null)
  const [editName, setEditName] = useState("")
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [editError, setEditError] = useState("")

  const getCourseStats = (course: Course) => ({
    total: course.assignments.length,
    submitted: course.assignments.filter(a => a.status === 'submitted').length,
    inProgress: course.assignments.filter(a => a.status === 'in_progress').length,
    pending: course.assignments.filter(a => a.status === 'pending').length,
  })

  const getCourseColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500'
    ]
    return colors[index % colors.length]
  }

  const openEdit = (course: Course) => {
    setEditingCourse(course)
    setEditName(course.name)
    setEditError("")
  }

  const handleEdit = async () => {
    if (!editingCourse) return
    if (!editName.trim()) { setEditError("Course name is required"); return }
    if (editName.trim().length < 2) { setEditError("Name must be at least 2 characters"); return }
    setEditLoading(true)
    try {
      const res = await fetch(`/api/courses/${editingCourse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      })
      if (!res.ok) throw new Error()
      setEditingCourse(null)
      router.refresh()
    } catch {
      setEditError("Failed to update. Try again.")
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingCourse) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/courses/${deletingCourse.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setDeletingCourse(null)
      router.refresh()
    } catch {
        alert("Failed to delete. Try again.")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Course Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No courses yet</h3>
          <p className="text-muted-foreground mb-6">Get started by adding your first course</p>
          <Link href="/courses/new">
            <button className="btn-primary px-6 py-2 rounded-lg">Create Course</button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const stats = getCourseStats(course)
            const colorClass = getCourseColor(index)
            return (
              <div key={course.id} className="card-hover bg-card rounded-xl p-6 border shadow-sm">
                {/* Course Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">{stats.total} assignments</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEdit(course)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingCourse(course)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress */}
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
                    <div className="p-2 rounded-lg bg-yellow-50 border border-yellow-200">
                      <div className="text-sm font-medium text-yellow-800">{stats.pending}</div>
                      <div className="text-xs text-yellow-600">Pending</div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                      <div className="text-sm font-medium text-blue-800">{stats.inProgress}</div>
                      <div className="text-xs text-blue-600">In Progress</div>
                    </div>
                    <div className="p-2 rounded-lg bg-green-50 border border-green-200">
                      <div className="text-sm font-medium text-green-800">{stats.submitted}</div>
                      <div className="text-xs text-green-600">Submitted</div>
                    </div>
                  </div>
                </div>

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
                {courses.reduce((sum, c) => sum + c.assignments.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Total Assignments</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <div className="text-2xl font-bold text-foreground">
                {courses.reduce((sum, c) => sum + c.assignments.filter(a => a.status === 'submitted').length, 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Completed</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-accent/50">
              <div className="text-2xl font-bold text-foreground">
                {courses.reduce((sum, c) => sum + c.assignments.filter(a => a.status === 'in_progress').length, 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">In Progress</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingCourse(null)} />
          <div className="relative bg-card rounded-2xl border shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Edit Course</h2>
              <button
                onClick={() => setEditingCourse(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => { setEditName(e.target.value); setEditError("") }}
                onKeyDown={(e) => e.key === "Enter" && handleEdit()}
                className={`input-field ${editError ? "border-destructive ring-2 ring-destructive/20" : ""}`}
                autoFocus
              />
              {editError && <p className="text-xs text-destructive">{editError}</p>}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditingCourse(null)}
                className="flex-1 btn-secondary py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                disabled={editLoading}
                className=" btn-primary py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {editLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeletingCourse(null)} />
          <div className="relative bg-card rounded-2xl border shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-destructive/10 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Delete Course</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to delete <span className="font-medium text-foreground">&quot;{deletingCourse.name}&quot;</span>?
                  This will also delete all {deletingCourse.assignments.length} associated assignments. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingCourse(null)}
                className="flex-1 btn-secondary py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className=" bg-destructive text-destructive-foreground hover:bg-destructive/90 py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-colors font-medium"
              >
                {deleteLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}