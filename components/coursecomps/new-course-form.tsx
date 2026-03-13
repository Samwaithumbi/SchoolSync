"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, Palette } from "lucide-react"


export default function NewCourseForm(){
    const router = useRouter()

  const [form, setForm] = useState({
    name: "",
    color: "#3b82f6",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    try {
      const res = await fetch("/api/course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
  
      if (!res.ok) {
        throw new Error("Failed to create course")
      }
  
      router.push("/courses")
    } catch (error) {
      console.error("Error creating course:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const predefinedColors = [
    "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", 
    "#ef4444", "#06b6d4", "#ec4899", "#6366f1"
  ]
    return(
        <div>
              {/* Form Card */}
      <div className="bg-card rounded-xl p-8 border shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-foreground">
              Course Name
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="name"
                type="text"
                name="name"
                required
                placeholder="e.g. Computer Networks"
                value={form.name}
                onChange={handleChange}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Course Color */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Course Color
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Palette className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-16 h-10 rounded-lg border cursor-pointer"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-border"
                    style={{ backgroundColor: form.color }}
                  />
                  <span className="text-sm text-muted-foreground font-mono">
                    {form.color}
                  </span>
                </div>
              </div>
              
              {/* Predefined Colors */}
              <div className="flex flex-wrap gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, color })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      form.color === color ? 'border-primary scale-110' : 'border-border hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-lg bg-accent/50 border">
            <p className="text-sm font-medium text-muted-foreground mb-3">Preview</p>
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: form.color }}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">
                  {form.name || "Course Name"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  0 assignments
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading || !form.name.trim()}
              className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <span>Create Course</span>
                </>
              )}
            </button>

            <Link
              href="/courses"
              className="btn-secondary px-6 py-2 rounded-lg"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
        </div>
    )
}