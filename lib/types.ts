//types.ts
export type Status = "pending" | "in_progress" | "submitted"
export type Priority = "low" | "medium" | "high"

export type Course = {
    id:number
    name:string
    
}
export type Assignment = {
    id: number
    title: string
    courseId: number
    description: string | null
    dueDate: Date
    priority: Priority
    status: Status
  }
  
  export type AssignmentWithCourse = Assignment & {
    course: {
      id: number
      name: string
      createdAt: Date
    }
  }
export type Filters = {
    query: string
    course: string
    status: string
    priority: string
  }