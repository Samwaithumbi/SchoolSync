"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Menu,
  X,
} from "lucide-react"
import { UserButton } from "@clerk/nextjs"

type SidebarLink = {
  id: number
  label: string
  href: string
  icon: React.ElementType
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { id: 1, label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: 2, label: "Assignments", href: "/assignments", icon: ClipboardList },
  { id: 3, label: "Courses", href: "/courses", icon: BookOpen },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        aria-label="Toggle sidebar"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-md bg-slate-900 p-2 text-white shadow md:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-slate-900 text-slate-200
          transform transition-transform duration-300
          md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
        aria-label="Primary Sidebar"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 text-lg font-bold text-white">
          <GraduationCap className="h-6 w-6" aria-hidden />
          <span className="text-blue-400">School</span>Sync
          <UserButton />
        </div>

        <nav className="mt-4 px-3">
  <ul className="space-y-1">
    {SIDEBAR_LINKS.map(({ id, label, href, icon: Icon }) => {
      const isActive = pathname === href

      return (
        <li key={id}>
          <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            onClick={() => setOpen(false)}
            className={`
              flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium
              transition-colors
              ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        </li>
      )
    })}
  </ul>
</nav>
      </aside>
    </>
  )
}