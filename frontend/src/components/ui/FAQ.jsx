// FAQ.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Study Buddy?",
      answer:
        "Study Buddy is a student-focused platform that helps learners connect, share notes, and create study sessions together.",
    },
    {
      question: "Is Study Buddy free to use?",
      answer:
        "Yes! Study Buddy is completely free for students. All you need is an account to start collaborating.",
    },
    {
      question: "How do study sessions work?",
      answer:
        "Students can schedule group or one-on-one sessions, share topics, and prepare together using collaborative tools.",
    },
    {
      question: "Can I upload my own notes?",
      answer:
        "Absolutely. You can upload, share, and access notes from other students to make studying easier and more efficient.",
    },
    {
      question: "Who can join Study Buddy?",
      answer:
        "Any student across South Africa can join — whether you’re in high school, college, or university.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="bg-white py-20 px-6 md:px-12 lg:px-20 font-inter"
    >
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Frequently Asked <span className="text-blue-600">Questions</span>
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Everything you need to know about Study Buddy — simple, clear, and
          helpful answers for students.
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition"
          >
            <button
              className="w-full flex justify-between items-center p-5 text-left text-gray-900 font-medium"
              onClick={() => toggleFAQ(i)}
            >
              <span className="flex items-center gap-2">
                <span className="text-blue-600"></span>
                {faq.question}
              </span>
              <span
                className={`transform transition-transform ${
                  openIndex === i ? "rotate-180 text-blue-600" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </button>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-5 text-gray-700"
                >
                  <p className="flex items-start gap-2">
                    <span className="text-yellow-500"></span>
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
