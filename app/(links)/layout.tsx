import Sidebar from "@/components/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assignment Tracker",
  description: "Notes assignments for deadline notifications",
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}