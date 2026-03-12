export default function HowItWorks() {
    const steps = [
      "Create your account",
      "Add your courses",
      "Add assignments and deadlines",
      "Track progress and submit on time"
    ]
  
    return (
      <section id="how" className="py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
  
          <h2 className="text-3xl font-bold">
            How it works
          </h2>
  
          <div className="mt-12 grid md:grid-cols-4 gap-8">
  
            {steps.map((step, i) => (
              <div key={i}>
                <div className="text-3xl font-bold mb-3">
                  {i + 1}
                </div>
  
                <p className="text-gray-600">
                  {step}
                </p>
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    )
  }