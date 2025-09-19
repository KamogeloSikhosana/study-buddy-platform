import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ open, onClose, goSignup, goForgot }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const mockUsers = [
    { id: 1, email: "student@test.com", password: "student12", name: "Demo Student", role: "student", redirect: "/" },
    { id: 2, email: "society@test.com", password: "society12", name: "Society Admin", role: "society-admin", redirect: "/society-admin" },
    { id: 3, email: "admin@test.com", password: "admin12", name: "Platform Admin", role: "admin", redirect: "/admin" },
  ];

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const user = mockUsers.find(
      (u) => u.email === email.trim() && u.password === password
    );

    if (user) {
      login(user);
      navigate(user.redirect, { replace: true });
      handleClose();
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-md rounded-2xl bg-white p-6 space-y-4">

          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-dark/60 hover:text-blue-600 transition text-2xl leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src="/src/assets/logo.png" alt="Study Buddy Logo" className="h-24 w-auto" />
          </div>

          {/* Title */}
          <p className="text-xl font-semibold text-center text-dark">
            Welcome to Study Buddy! Connect with your ideal study partners.
          </p>

          {/* Inline error */}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3">

            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">Email</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">Password</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                  className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={goForgot}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 py-2 text-white font-semibold hover:opacity-90 transition"
            >
              Log In
            </button>
          </form>

          {/* Switch to signup */}
          <p className="text-center text-sm text-dark">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => { resetForm(); goSignup?.(); }}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
