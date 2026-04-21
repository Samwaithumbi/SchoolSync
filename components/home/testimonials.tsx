export default function Testimonials() {
    const testimonials = [
      {
        name: "James K.",
        text: "This app saved me from missing deadlines."
      },
      {
        name: "Sarah M.",
        text: "Perfect tool for university students."
      },
      {
        name: "Daniel O.",
        text: "Clean and easy to use."
      }
    ]
  
    return (
      <section id="testimonials" className="py-24 bg-gray-50">
  
        <div className="max-w-6xl mx-auto px-6">
  
          <h2 className="text-3xl font-bold text-center">
            Loved by students
          </h2>
  
          <div className="grid md:grid-cols-3 gap-8 mt-16">
  
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white border p-6 rounded-xl"
              >
                <p className="text-gray-600">
                  &quot;{t.text}&quot;
                </p>
  
                <p className="mt-4 font-semibold">
                  {t.name}
                </p>
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    )
  }