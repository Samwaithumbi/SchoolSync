import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AssignTrack - Assignment Manager",
    template: "%s | AssignTrack"
  },
  description:
    "Track assignments, deadlines and course work easily with our modern assignment management system.",
  keywords: ["assignments", "courses", "deadlines", "education", "student", "task management"],
  authors: [{ name: "AssignTrack Team" }],
  creator: "AssignTrack",
  publisher: "AssignTrack",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "AssignTrack - Assignment Manager",
    description: "Track assignments, deadlines and course work easily",
    type: "website",
    locale: "en_US",
    siteName: "AssignTrack",
  },
  twitter: {
    card: "summary_large_image",
    title: "AssignTrack - Assignment Manager",
    description: "Track assignments, deadlines and course work easily",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"suppressHydrationWarning >
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
