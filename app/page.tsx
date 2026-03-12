import Navbar from "@/components/home/navbar"
import Hero from "@/components/home/hero"
import Features from "@/components/home/features"
import HowItWorks from "@/components/home/how-it-works"
import Testimonials from "@/components/home/testimonials"
import CTA from "@/components/home/cta"
import Footer from "@/components/home/footer"


export default function Home() {
  return (
    <main className="gradient-bg min-h-screen">
      <div className="relative">
        <Navbar />
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}