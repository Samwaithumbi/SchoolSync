import Link from "next/link"
import { BookOpen, ArrowLeft, Palette } from "lucide-react"
import NewCourseForm from "@/components/coursecomps/new-course-form"

export default function Page() {
  

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/courses"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            New Course
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new course to organize your assignments
          </p>
        </div>
      </div>

      <NewCourseForm/>

      {/* Help Section */}
      <div className="bg-card rounded-xl p-6 border shadow-sm">
        <h3 className="font-semibold text-foreground mb-3">Tips for creating courses</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start space-x-2">
            <span className="text-primary mt-1">•</span>
            <span>Use clear, descriptive names for easy identification</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary mt-1">•</span>
            <span>Choose colors that help you quickly distinguish between courses</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-primary mt-1">•</span>
            <span>You can always edit the course details later</span>
          </li>
        </ul>
      </div>
    </div>
  )
}