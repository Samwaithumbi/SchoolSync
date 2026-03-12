import {prisma} from '@/lib/prisma';
import {NextResponse, NextRequest} from 'next/server';
import { Status} from "@prisma/client"
import { Priority} from "@prisma/client"

// GET /api/assignments
export async function GET() {
  try {
    const assignments = await prisma.assignment.findMany({
      orderBy: { dueDate: 'asc' },
    });
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      {error: 'Failed to fetch assignments.'},
      {status: 500}
    );
  }
}

export async function POST(req: NextRequest) {
    try {
      const body = await req.json()
      const { title, description, courseId, dueDate, priority, status } = body
  
      if (!title || !courseId || !dueDate) {
        return NextResponse.json(
          { error: "Title, course, and due date are required." },
          { status: 400 }
        )
      }
  
      const assignment = await prisma.assignment.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          courseId: Number(courseId),
          dueDate: new Date(dueDate),
          status: status as Status,
          priority: priority as Priority
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