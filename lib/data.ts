import { Assignment, Course } from "./types";

// ─── Courses ──────────────────────────────────────────────────
export const courses: Course[] = [
  { id: "c1", name: "Data Structures & Algorithms", color: "#3B82F6" },
  { id: "c2", name: "Web Development", color: "#8B5CF6" },
  { id: "c3", name: "Database Systems", color: "#F97316" },
  { id: "c4", name: "Software Engineering", color: "#22C55E" },
  { id: "c5", name: "Computer Networks", color: "#EF4444" },
];

// ─── Assignments ──────────────────────────────────────────────
export const assignments: Assignment[] = [
 
  {
    id: "a2",
    title: "Build a REST API with Next.js",
    courseId: "c2",
    description:
      "Create a fully functional REST API using Next.js API routes. Must include GET, POST, PUT, and DELETE endpoints with proper error handling.",
    dueDate: "2025-03-08",
    priority: "high",
    status: "pending",
  },
  {
    id: "a3",
    title: "ER Diagram for Hospital Management",
    courseId: "c3",
    description:
      "Design a complete entity-relationship diagram for a hospital management system covering patients, doctors, appointments, and billing.",
    dueDate: "2025-02-28",
    priority: "medium",
    status: "submitted",
  },
  {
    id: "a4",
    title: "UML Class Diagram",
    courseId: "c4",
    description:
      "Create UML class diagrams for the library management system case study. Include inheritance, associations, and multiplicity.",
    dueDate: "2025-02-20",
    priority: "medium",
    status: "submitted",
  },
  {
    id: "a5",
    title: "TCP vs UDP Research Paper",
    courseId: "c5",
    description:
      "Write a 2000-word research paper comparing TCP and UDP protocols, with real-world use cases and performance benchmarks.",
    dueDate: "2025-02-18",
    priority: "low",
    status: "pending",
  },
  {
    id: "a6",
    title: "Graph Traversal Algorithms",
    courseId: "c1",
    description:
      "Implement BFS and DFS from scratch and demonstrate their use on a sample graph. Compare time and space complexity.",
    dueDate: "2025-03-15",
    priority: "medium",
    status: "pending",
  },
  {
    id: "a7",
    title: "Responsive Portfolio Website",
    courseId: "c2",
    description:
      "Build a fully responsive personal portfolio website using HTML, CSS, and JavaScript. Must work on mobile, tablet, and desktop.",
    dueDate: "2025-03-20",
    priority: "low",
    status: "pending",
  },
  {
    id: "a8",
    title: "SQL Query Optimization",
    courseId: "c3",
    description:
      "Analyze and optimize 10 given SQL queries using indexes, query plans, and rewriting techniques. Document before/after performance.",
    dueDate: "2025-03-10",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "a9",
    title: "Agile Sprint Planning Report",
    courseId: "c4",
    description:
      "Document a two-week agile sprint plan for the team project. Include user stories, story points, and a burndown chart.",
    dueDate: "2025-03-12",
    priority: "medium",
    status: "pending",
  },
  {
    id: "a10",
    title: "Subnetting and CIDR Notation",
    courseId: "c5",
    description:
      "Solve 20 subnetting problems using CIDR notation. Show all working including network address, broadcast address, and usable hosts.",
    dueDate: "2025-03-18",
    priority: "low",
    status: "in-progress",
  },
];

// ─── Helper Functions ──────────────────────────────────────────

/** Get a course by its ID */
export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

/** Get an assignment by its ID */
export function getAssignmentById(id: string): Assignment | undefined {
  return assignments.find((a) => a.id === id);
}

/** Get all assignments for a specific course */
export function getAssignmentsByCourse(courseId: string): Assignment[] {
  return assignments.filter((a) => a.courseId === courseId);
}

/** Get assignments by status */
export function getAssignmentsByStatus(status: Assignment["status"]): Assignment[] {
  return assignments.filter((a) => a.status === status);
}

/** Get overdue assignments (past due date and not submitted) */
export function getOverdueAssignments(): Assignment[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return assignments.filter((a) => {
    const due = new Date(a.dueDate);
    return due < today && a.status !== "submitted";
  });
}

/** Get upcoming assignments (due within next N days, not submitted) */
export function getUpcomingAssignments(days: number = 7): Assignment[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = new Date(today);
  future.setDate(future.getDate() + days);

  return assignments
    .filter((a) => {
      const due = new Date(a.dueDate);
      return due >= today && due <= future && a.status !== "submitted";
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

/** Get dashboard stats */
export function getDashboardStats() {
  return {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    inProgress: assignments.filter((a) => a.status === "in-progress").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    overdue: getOverdueAssignments().length,
  };
}

/** Format a date string to readable format e.g. "Mar 5, 2025" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Check if an assignment is overdue */
export function isOverdue(assignment: Assignment): boolean {
  if (assignment.status === "submitted") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(assignment.dueDate) < today;
}

/** Get days until due (negative = overdue) */
export function getDaysUntilDue(dueDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}