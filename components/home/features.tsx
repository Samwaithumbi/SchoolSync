export default function Features() {
    const features = [
      {
        title: "Assignment Tracking",
        description: "Keep track of all assignments across multiple courses."
      },
      {
        title: "Deadline Alerts",
        description: "Receive reminders before deadlines."
      },
      {
        title: "Course Organization",
        description: "Organize assignments by course."
      },
      {
        title: "Submission Status",
        description: "Know what is completed and what is pending."
      }
    ]
  
    return (
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
  
          <h2 className="text-3xl font-bold text-center">
            Everything you need to stay organized
          </h2>
  
          <div className="grid md:grid-cols-4 gap-8 mt-16">
  
            {features.map((feature, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-xl border"
              >
                <h3 className="font-semibold text-lg">
                  {feature.title}
                </h3>
  
                <p className="mt-3 text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
  
          </div>
  
        </div>
      </section>
    )
  }