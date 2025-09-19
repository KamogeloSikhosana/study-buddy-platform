import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-slate-200/80 to-slate-100/80 text-gray-800 mt-20">
      {/* Glow divider top */}
      <div className="absolute -top-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm"></div>

      <div className="mx-auto max-w-7xl px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* === Brand / About === */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/src/assets/logo.png"
              alt="Pukke Connect Logo"
              className="h-12 w-12 rounded-full ring-2 ring-gray-300/50"
            />
            <span className="text-xl font-semibold">
              Study <span className="text-blue-500">Buddy</span>
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Connecting students across South Africa to the perfect study partners and groups through smart tools and collaborative learning.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="w-4" />
              info@studybuddy.co.za
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="w-4" />
              +27 18 205 3044
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="w-4" />
              Halfway House, Midrand, Gauteng 
            </li>
          </ul>
        </div>

        {/* === Platform === */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Platform</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#hero" className="hover:text-blue-500">Home </a></li>
            <li><a href="#about-us" className="hover:text-blue-500">About</a></li>
            <li><a href="#societies-section" className="hover:text-blue-500">Testimonials</a></li>
            <li><a href="#faq" className="hover:text-blue-500">FAQ</a></li>
          </ul>
        </div>

        {/* === Support === */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#help" className="hover:text-blue-500">Help Center</a></li>
            <li><a href="#contact" className="hover:text-blue-500">Contact Us</a></li>
            <li><a href="#report" className="hover:text-blue-500">Report Issue</a></li>
            <li><a href="#community" className="hover:text-blue-500">Community Guidelines</a></li>
          </ul>
        </div>

        {/* === Legal === */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="#privacy" className="hover:text-blue-500">Privacy Policy</a></li>
            <li><a href="#terms" className="hover:text-blue-500">Terms of Service</a></li>
            <li><a href="#cookies" className="hover:text-blue-500">Cookie Policy</a></li>
            <li><a href="#data" className="hover:text-blue-500">Data Protection</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300/30 mt-6 py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Study Buddy · Built for students in South African Universities.
      </div>
    </footer>
  );
}
