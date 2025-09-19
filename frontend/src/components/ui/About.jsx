// About.jsx
import { motion } from "framer-motion";

export default function About() {
  const features = [
    {
      id: "01",
      title: "Strong Community",
      desc: "Over 5,000 students already connected across South Africa, building networks that last a lifetime.",
    },
    {
      id: "02",
      title: "Knowledge Sharing",
      desc: "More than 1,000 notes exchanged, ensuring students never study alone and always learn smarter.",
    },
    {
      id: "03",
      title: "Collaborative Growth",
      desc: "Thousands of study sessions scheduled to encourage teamwork, motivation, and shared success.",
    },
  ];

  return (
    <section id="about" className="bg-white py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <p className="uppercase tracking-widest text-sm text-gray-500 mb-2">
          About Us
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          What Sets Us Apart?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-16">
          At <span className="font-semibold text-blue-600">Study Buddy</span>, we
          believe studying is better together. We provide tools to connect,
          collaborate, and succeed as one community of students across South
          Africa.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-white shadow-md rounded-2xl p-8 hover:shadow-lg transition"
            >
              {/* Number with gradient */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold mb-6">
                {item.id}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6">{item.desc}</p>

              {/* Link */}
              <a
                href="#"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
              >
                Learn more →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
