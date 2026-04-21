import { prisma } from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { Status, Priority } from "@prisma/client"

// GET /api/assignments
export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        course: {
          userId: user.id, // 🔥 filter by logged-in user
        },
      },
      orderBy: { dueDate: 'asc' },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assignments.' },
      { status: 500 }
    )
  }
}

// POST /api/assignments
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, courseId, dueDate, priority, status } = body

    if (!title || !courseId || !dueDate) {
      return NextResponse.json(
        { error: "Title, course, and due date are required." },
        { status: 400 }
      )
    }

    // 🔥 Ensure the course belongs to the user
    const course = await prisma.course.findFirst({
      where: {
        id: Number(courseId),
        userId: user.id,
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: "Invalid course or unauthorized." },
        { status: 403 }
      )
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        courseId: course.id,
        dueDate: new Date(dueDate),
        status: status as Status,
        priority: priority as Priority,
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error("Error creating assignment:", error)
    return NextResponse.json(
      { error: "Failed to create assignment." },
      { status: 500 }
    )
  }
}