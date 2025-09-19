import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";

export default function ForgotPasswordModal({ open, onClose, goLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setEmail("");
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // TODO: Replace with actual API call to send reset link
    setSuccess(`A password reset link has been sent to ${email}.`);
    setError("");
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-md rounded-2xl bg-white p-6 space-y-4 border border-white shadow-lg">

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-dark/60 hover:text-blue-600 transition text-2xl leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-3">
            <img src="/src/assets/logo.png" alt="Study Buddy Logo" className="h-16 w-auto" />
          </div>

          {/* Title */}
          <Dialog.Title className="text-2xl font-semibold text-center text-dark">
            Forgot Password
          </Dialog.Title>
          <p className="text-center text-blue-600">Enter your email to receive a reset link</p>

          {/* Inline error */}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">Email</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                  {/* Mail icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 py-2 text-white font-semibold shadow hover:opacity-90 transition"
            >
              Send Reset Link
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
