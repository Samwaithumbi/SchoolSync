import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";

config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {

  const courses = await prisma.course.createMany({
    data: [
      { name: "Algorithms" },
      { name: "Web Development" },
      { name: "Database Systems" },
      { name: "Software Engineering" },
      { name: "Computer Networks" },
    ],
    skipDuplicates: true
  });

  console.log("Courses seeded");

  await prisma.assignment.createMany({
    data: [
      {
        title: "Build a REST API with Next.js",
        courseId: 2,
        dueDate: new Date("2025-03-08"),
        status: "pending"
      },
      {
        title: "ER Diagram for Hospital Management",
        courseId: 3,
        dueDate: new Date("2025-02-28"),
        status: "submitted"
      },
      {
        title: "UML Class Diagram",
        courseId: 4,
        dueDate: new Date("2025-02-20"),
        status: "submitted"
      },
      {
        title: "TCP vs UDP Research Paper",
        courseId: 5,
        dueDate: new Date("2025-02-18"),
        status: "pending"
      },
      {
        title: "Graph Traversal Algorithms",
        courseId: 1,
        dueDate: new Date("2025-03-15"),
        status: "pending"
      },
      {
        title: "Responsive Portfolio Website",
        courseId: 2,
        dueDate: new Date("2025-03-20"),
        status: "pending"
      },
      {
        title: "SQL Query Optimization",
        courseId: 3,
        dueDate: new Date("2025-03-10"),
        status: "in_progress"
      },
      {
        title: "Agile Sprint Planning Report",
        courseId: 4,
        dueDate: new Date("2025-03-12"),
        status: "pending"
      },
      {
        title: "Subnetting and CIDR Notation",
        courseId: 5,
        dueDate: new Date("2025-03-18"),
        status: "in_progress"
      }
    ]
  });

  console.log("Assignments seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });