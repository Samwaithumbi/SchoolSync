"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Course } from "@/lib/types"
import {
  BookOpen,
  Calendar,
  FileText,
  Tag,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react"

interface Props {
    courses: Course[]
  }

type FormData = {
  title: string
  description: string
  courseId: number | ""
  dueDate: string
  priority: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "submitted"
}

type FormErrors = Partial<Record<keyof FormData, string>>

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low", color: "border-green-400 text-green-700 bg-green-50", dot: "bg-green-400" },
  { value: "medium", label: "Medium", color: "border-yellow-400 text-yellow-700 bg-yellow-50", dot: "bg-yellow-400" },
  { value: "high", label: "High", color: "border-red-400 text-red-700 bg-red-50", dot: "bg-red-400" },
]

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", icon: AlertCircle, color: "border-yellow-400 text-yellow-700 bg-yellow-50" },
  { value: "in_progress", label: "In Progress", icon: Loader2, color: "border-blue-400 text-blue-700 bg-blue-50" },
  { value: "submitted", label: "Submitted", icon: CheckCircle, color: "border-green-400 text-green-700 bg-green-50" },
]



export default function NewAssignmentForm({courses}:Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})
    const [serverError, setServerError] = useState("")
  
    const [form, setForm] = useState<FormData>({
      title: "",
      description: "",
      courseId: "",
      dueDate: "",
      priority: "medium",
      status: "pending",
    })
  
       const validate = (): boolean => {
      const newErrors: FormErrors = {}
      if (!form.title.trim()) newErrors.title = "Title is required"
      else if (form.title.trim().length < 3) newErrors.title = "Title must be at least 3 characters"
      if (!form.courseId) newErrors.courseId = "Please select a course"
      if (!form.dueDate) newErrors.dueDate = "Due date is required"
      else if (new Date(form.dueDate) < new Date(new Date().toDateString()))
        newErrors.dueDate = "Due date cannot be in the past"
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }
  
    const handleSubmit = async () => {
      setServerError("")
      if (!validate()) return
      setLoading(true)
      try {
        const res = await fetch("/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          const data = await res.json()
          setServerError(data.error || "Something went wrong.")
          return
        }
        setSuccess(true)
        setTimeout(() => router.push("/assignments"), 1500)
      } catch {
        setServerError("Network error. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  
    const update = (field: keyof FormData, value: string | number) => {
        setForm((prev) => ({ ...prev, [field]: value }))
      }
  
    const minDate = new Date().toISOString().split("T")[0]
  
    if (success) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4 animate-pulse">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Assignment Created!</h2>
            <p className="text-muted-foreground">Redirecting to assignments...</p>
          </div>
        </div>
      )
    }

   return (
    <div>

        {/* Server Error */}
      {serverError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {serverError}
        </div>
      )}

         {/* Form Card */}
      <div className="bg-card border rounded-2xl shadow-sm divide-y">

        {/* Title */}
        <div className="p-6 space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Assignment Title <span className="text-destructive">*</span>
        </label>
        <input
            type="text"
            placeholder="e.g. Build a REST API with Next.js"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className={`input-field ${errors.title ? "border-destructive ring-destructive/20 ring-2" : ""}`}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>

        {/* Course */}
        <div className="p-6 space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            Course <span className="text-destructive">*</span>
        </label>
        {courses.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading courses...
            </div>
            ) : (
            <select
                value={form.courseId}
                onChange={(e) => update("courseId", Number(e.target.value))}
                className="input-field"
            >
                <option value="">Select a course...</option>
                {courses.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.name}
                </option>
                ))}
            </select>
            )}
        {errors.courseId && <p className="text-xs text-destructive">{errors.courseId}</p>}
        </div>

        {/* Due Date */}
        <div className="p-6 space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Due Date <span className="text-destructive">*</span>
        </label>
        <input
            type="date"
            min={minDate}
            value={form.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            className={`input-field ${errors.dueDate ? "border-destructive ring-destructive/20 ring-2" : ""}`}
        />
        {errors.dueDate && <p className="text-xs text-destructive">{errors.dueDate}</p>}
        </div>

        {/* Priority */}
        <div className="p-6 space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Tag className="w-4 h-4 text-muted-foreground" />
            Priority
        </label>
        <div className="flex gap-3">
            {PRIORITY_OPTIONS.map((opt) => (
            <button
                key={opt.value}
                type="button"
                onClick={() => update("priority", opt.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                form.priority === opt.value
                    ? opt.color + " shadow-sm scale-[1.02]"
                    : "border-border text-muted-foreground hover:border-border/80 bg-background"
                }`}
            >
                <span className={`w-2 h-2 rounded-full ${form.priority === opt.value ? opt.dot : "bg-muted-foreground"}`} />
                {opt.label}
            </button>
            ))}
        </div>
        </div>

        {/* Status */}
        <div className="p-6 space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
            Status
        </label>
        <div className="flex gap-3">
            {STATUS_OPTIONS.map((opt) => {
            const Icon = opt.icon
            return (
                <button
                key={opt.value}
                type="button"
                onClick={() => update("status", opt.value)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    form.status === opt.value
                    ? opt.color + " shadow-sm scale-[1.02]"
                    : "border-border text-muted-foreground hover:border-border/80 bg-background"
                }`}
                >
                <Icon className="w-3.5 h-3.5" />
                {opt.label}
                </button>
            )
            })}
        </div>
        </div>

        {/* Description */}
        <div className="p-6 space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Description
            <span className="text-xs text-muted-foreground font-normal ml-1">(optional)</span>
        </label>
        <textarea
            placeholder="What does this assignment involve? Any important notes..."
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="input-field resize-none"
        />
        </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pb-8">
        <Link href="/assignments" className="flex-1">
        <button
            type="button"
            className="w-full btn-secondary px-4 py-2.5 rounded-lg"
        >
            Cancel
        </button>
        </Link>
        <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
        {loading ? (
            <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating...
            </>
        ) : (
            <>
            <Sparkles className="w-4 h-4" />
            Create Assignment
            </>
        )}
        </button>
        </div>
    </div>
   )

}