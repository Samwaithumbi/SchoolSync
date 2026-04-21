import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from '@clerk/nextjs/server'

// Get all courses
export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courses = await prisma.course.findMany({
      where: { userId: user.id },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    })

    return NextResponse.json(courses)
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}

// Create a new course
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json(
        { error: "Course name is required" },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        name: name.trim(),
        userId: user.id,
      },
    })
    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    )
  }
}
