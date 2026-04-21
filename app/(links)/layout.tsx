import Sidebar from "@/components/sidebar";
import { syncUser } from "@/lib/syncUser";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assignment Tracker",
  description: "Notes assignments for deadline notifications",
};

export default async function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await syncUser()
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}