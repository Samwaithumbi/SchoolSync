"use client"

import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs"
import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4">
      <Link href="/" className="text-4xl font-bold">SchoolSync</Link>

      <div className="flex items-center gap-4">
        <Show when="signed-out">
          <SignInButton forceRedirectUrl="/dashboard">
            <button className="text-sm font-medium">Sign In</button>
          </SignInButton>
          <SignUpButton forceRedirectUrl="/dashboard">
            <button className="bg-purple-700 text-white rounded-full text-sm h-10 px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <Link href="/dashboard" className="text-sm font-medium">dash</Link>
          <UserButton/>
        </Show>
      </div>
    </nav>
  )
}