import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-24 text-center">

      <h2 className="text-3xl font-bold">
        Ready to stay organized?
      </h2>

      <p className="mt-4 text-gray-600">
        Start tracking assignments today.
      </p>

      <Link
        href="/register"
        className="inline-block mt-6 bg-black text-white px-8 py-3 rounded-lg"
      >
        Get Started Free
      </Link>

    </section>
  )
}