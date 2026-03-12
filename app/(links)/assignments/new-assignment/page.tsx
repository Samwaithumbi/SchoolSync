import NewAssignmentForm from "@/components/assignments/new-assignment-form"
import { prisma } from "@/lib/prisma"
import {ArrowLeft, Sparkles} from "lucide-react"
import Link from "next/link"

export default async function NewAssignmentPage() {
  
  const courses = await prisma.course.findMany()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/assignments"
          className="p-2 rounded-lg border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            New Assignment
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fill in the details below to track your work</p>
        </div>
      </div>

      <div>
        <NewAssignmentForm courses={courses}/>
      </div>

     
    </div>
  )
}