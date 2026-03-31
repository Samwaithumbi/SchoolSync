import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET(
  req: NextRequest,
  {params}:{params: Promise<{id:string}>}
){
    try{
        const {id} = await params
        const course = await prisma.course.findUnique({
            where:{id:Number(id)},
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
    const { id } = await params  // ← await here
    const { name } = await req.json()
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
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
    const { id } = await params  // ← await params
    await prisma.course.delete({
      where: { id: Number(id) },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
  }
}