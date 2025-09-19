// Testimonial.jsx
import { FaStar } from "react-icons/fa";

export default function Testimonial() {
  const testimonials = [
    {
      name: "Palesa M.",
      image: "/src/assets/photo3.jpg",
      rating: 5,
      feedback:
        "Study Buddy helped me find study partners for difficult subjects. I improved my grades and made new friends!",
    },
    {
      name: "Zinhle N.",
      image: "/src/assets/photo1.jpg",
      rating: 4,
      feedback:
        "I love how easy it is to share notes and schedule group study sessions. Highly recommended!",
    },
    {
      name: "Lerato K.",
      image: "/src/assets/photo2.jpg",
      rating: 5,
      feedback:
        "The platform is intuitive and really encourages collaboration. I never study alone anymore!",
    },
    
  ];

  return (
    <section id="testimonials" className="bg-white py-20 px-6 md:px-12 lg:px-20 font-inter">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          What Students <span className="text-blue-600">Say</span>
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Hear from students who have benefited from Study Buddy — their experiences and success stories.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center text-center"
          >
            <img
              src={t.image}
              alt={t.name}
              className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-blue-200"
            />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.name}</h3>
            <div className="flex items-center mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-5 h-5 ${
                    i < t.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-700">{t.feedback}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
