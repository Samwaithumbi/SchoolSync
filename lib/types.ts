//types.ts
export type Status = "pending" | "in-progress" | "submitted"
export type Priority = "low" | "medium" | "high"

export type Course = {
    id:number
    name:string
    color:string
}
export type Assignment = {
    id:string
    title:string
    courseId:string
    description:string
    dueDate:string
    priority:Priority
    status:Status
}