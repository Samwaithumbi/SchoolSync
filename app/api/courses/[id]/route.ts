import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function GET(
  req: NextRequest,
  {params}:{params: Promise<{id:string}>}
){
    try{
        const user = await currentUser()
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const {id} = await params
        const course = await prisma.course.findFirst({
            where:{
                id:Number(id),
                userId: user.id
            },
            select:{
                id:true,
                name:true,
            }
        })
        if(!course){
            return NextResponse.json({error:"Course not found"},{status:404})
        }
        return NextResponse.json(course)
    }catch(e){
        console.error(e)
        return NextResponse.json({error:"Failed to fetch course"},{status:500})
    }
}

// update course by id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params  // ← await here
    const { name } = await req.json()
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Verify course belongs to user before updating
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: Number(id),
        userId: user.id,
      },
    })

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 404 })
    }

    const course = await prisma.course.update({
      where: { id: Number(id) },  // ← use id, not params.id
      data: { name: name.trim() },
    })
    return NextResponse.json(course)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
  }
}

// delete course by id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params  // ← await params
    
    // Verify course belongs to user before deleting
    const course = await prisma.course.findFirst({
      where: {
        id: Number(id),
        userId: user.id,
      },
    })

    if (!course) {
      return NextResponse.json({ error: "Course not found or unauthorized" }, { status: 404 })
    }

    await prisma.course.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}