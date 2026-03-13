import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    )
  }
}

// Create a new course
export async function POST(responce:NextResponse){
  try{
    const body = await responce.json()
    const {name} = body

    if(!name){
      return NextResponse.json(
        {error:"Course name is required"},
        {status:400}
      )
    }

    const course = await prisma.course.create({
      data:{
        name:name.trim(),
      }
    })
    return NextResponse.json(course,{status:201})
  }catch(error){
    console.error("Error creating course:",error)
    return NextResponse.json(
      {error:"Failed to create course"},
      {status:500}
    )
  }
}
