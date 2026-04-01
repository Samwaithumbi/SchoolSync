"use client"

import { useState, useEffect, useTransition } from "react"
import { createPortal } from "react-dom"
import { X, Loader2, Calendar, BookOpen } from "lucide-react"
import { AssignmentWithCourse, Course, Status, Priority } from "@/lib/types"

interface EditAssignmentModalProps {
  assignment: AssignmentWithCourse | null
  courses: Course[]
  isOpen: boolean
  onClose: () => void
  onSave: (updated: AssignmentWithCourse) => void
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "pending",     label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "submitted",   label: "Submitted" },
]

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "low",    label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high",   label: "High" },
]

export default function EditAssignmentModal({
  assignment,
  courses,
  isOpen,
  onClose,
  onSave,
}: EditAssignmentModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  // Guard createPortal against SSR — document.body doesn't exist on the server
  const [mounted, setMounted] = useState(false)

  const [form, setForm] = useState({
    title:       "",
    courseId:    0 as number,
    status:      "pending" as Status,
    priority:    "medium" as Priority,
    dueDate:     "",
    description: "",
  })

  useEffect(() => { setMounted(true) }, [])

  // Pre-fill form whenever a different assignment is opened
  useEffect(() => {
    if (assignment) {
      setError(null)
      setForm({
        title:       assignment.title,
        courseId:    assignment.courseId,
        status:      assignment.status,
        priority:    assignment.priority,
        dueDate:     new Date(assignment.dueDate).toISOString().split("T")[0],
        description: assignment.description ?? "",
      })
    }
  }, [assignment])

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    if (isOpen) window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "courseId" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        const res = await fetch(`/api/assignments/${assignment!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            dueDate: new Date(form.dueDate).toISOString(),
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.message ?? "Failed to update assignment")
        }

        const updated: AssignmentWithCourse = await res.json()
        onSave(updated)
        onClose()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong")
      }
    })
  }

  if (!mounted || !isOpen || !assignment) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-card w-full max-w-lg rounded-2xl border shadow-xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Edit Assignment</h2>
            <p className="text-sm text-muted-foreground truncate max-w-xs">{assignment.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="Assignment title"
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            {/* Course */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Course <span className="text-destructive">*</span>
              </label>
              <select
                name="courseId"
                required
                value={form.courseId}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              >
                <option value={0} disabled>Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                >
                  {PRIORITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Due Date <span className="text-destructive">*</span>
              </label>
              <input
                name="dueDate"
                type="date"
                required
                value={form.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Optional description..."
                className="w-full px-3 py-2 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 rounded-lg border text-sm font-medium text-foreground hover:bg-accent transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}