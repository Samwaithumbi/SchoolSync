import Link from "next/link"

export default function Hero() {
  return (
    <section className="py-24 text-center">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-5xl font-bold leading-tight">
          Never Miss Another Assignment Deadline
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          AssignTrack helps students organize assignments, track deadlines,
          and stay productive across all courses.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/register"
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Start Free
          </Link>

          <Link
            href="#features"
            className="border px-6 py-3 rounded-lg"
          >
            Learn More
          </Link>
        </div>

      </div>
    </section>
  )
}