"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link href="/" className="text-xl font-bold">
          AssignTrack
        </Link>

        <nav className="hidden md:flex gap-8 text-sm">
          <Link href="#features">Features</Link>
          <Link href="#how">How it works</Link>
          <Link href="#testimonials">Testimonials</Link>
        </nav>

        <div className="hidden md:flex gap-4">
          <Link href="/login" className="text-sm">
            Login
          </Link>

          <Link
            href="/register"
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4">
          <Link href="#features">Features</Link>
          <Link href="#how">How it works</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Get Started</Link>
        </div>
      )}
    </header>
  )
}