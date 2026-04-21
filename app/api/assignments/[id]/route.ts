import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Status, Priority } from "@/lib/types"
import { currentUser } from "@clerk/nextjs/server"

interface RouteParams {
  params: Promise<{ id: string }>
}

// ─── PATCH /api/assignments/[id] ─────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const assignmentId = Number(id)

    if (isNaN(assignmentId)) {
      return NextResponse.json({ message: "Invalid assignment ID" }, { status: 400 })
    }

    const body = await req.json()
    const { title, courseId, status, priority, dueDate, description } = body

    // Verify assignment belongs to user
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        course: {
          userId: user.id,
        },
      },
    })

    if (!existingAssignment) {
      return NextResponse.json({ message: "Assignment not found or unauthorized" }, { status: 404 })
    }

    // If changing course, verify new course belongs to user
    if (courseId && courseId !== existingAssignment.courseId) {
      const course = await prisma.course.findFirst({
        where: {
          id: Number(courseId),
          userId: user.id,
        },
      })

      if (!course) {
        return NextResponse.json({ message: "Invalid course or unauthorized" }, { status: 403 })
      }
    }

    // Validate required fields
    if (!title || !courseId || !status || !priority || !dueDate) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate enum values
    const validStatuses: Status[] = ["pending", "in_progress", "submitted"]
    const validPriorities: Priority[] = ["low", "medium", "high"]

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status value" }, { status: 400 })
    }
    if (!validPriorities.includes(priority)) {
      return NextResponse.json({ message: "Invalid priority value" }, { status: 400 })
    }

    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        title,
        courseId: Number(courseId),
        status,
        priority,
        dueDate: new Date(dueDate),
        description: description ?? null,
      },
      include: { course: true },
    })

    return NextResponse.json(updated)
  } catch (error: unknown) {
    // Prisma "record not found" error code
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 })
    }
    console.error("[PATCH /api/assignments/[id]]", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// ─── DELETE /api/assignments/[id] ────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const assignmentId = Number(id)

    if (isNaN(assignmentId)) {
      return NextResponse.json({ message: "Invalid assignment ID" }, { status: 400 })
    }

    // Verify assignment belongs to user before deleting
    const assignment = await prisma.assignment.findFirst({
      where: {
        id: assignmentId,
        course: {
          userId: user.id,
        },
      },
    })

    if (!assignment) {
      return NextResponse.json({ message: "Assignment not found or unauthorized" }, { status: 404 })
    }

    await prisma.assignment.delete({
      where: { id: assignmentId },
    })

    return NextResponse.json({ message: "Assignment deleted" }, { status: 200 })
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2025"
    ) {
      return NextResponse.json({ message: "Assignment not found" }, { status: 404 })
    }
    console.error("[DELETE /api/assignments/[id]]", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}