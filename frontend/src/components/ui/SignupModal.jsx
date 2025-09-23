import { Dialog } from "@headlessui/react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";


export default function SignupModal({ open, onClose, goLogin }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  //Uses Axios
  const handleSignup = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:3000/api/signup", {
      name,
      surname,
      email,
      password,
    });

    // Show success popup
    Swal.fire({
      icon: "success",
      title: "Signup Successful",
      text: response.data.message || "Account created successfully!",
      confirmButtonColor: "#3085d6",
    });

    // Save user into context
    login({
      id: response.data.student_id,
      name: `${name} ${surname}`,
      role: "student",
    });

    navigate("/", { replace: true });
    handleClose();
  } catch (err) {
    const errorMsg = err.response?.data?.error || "Something went wrong";

    // Show error popup
    Swal.fire({
      icon: "error",
      title: "Signup Failed",
      text: errorMsg,
      confirmButtonColor: "#d33",
    });

    setError(errorMsg);
  }
};



  const clearOnChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-md rounded-2xl bg-white p-6 space-y-4 border border-white shadow-lg">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-dark/60 hover:text-blue-600 transition text-2xl leading-none cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-3">
            <img src="/src/assets/logo.png" alt="Study Buddy Logo" className="h-30 w-auto" />
          </div>

          {/* Top Text */}
          <p className="text-1xl font-semibold text-center text-dark">
            Join Study Buddy today and find your ideal study partners!
          </p>

          {/* Inline error */}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            {/* Name & Surname */}
            <div className="grid grid-cols-2 gap-2">
              {/* Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-dark">Name</label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={clearOnChange(setName)}
                    className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter name"
                    required
                  />
                </div>
              </div>

              {/* Surname */}
              <div className="relative">
                <label className="block text-sm font-medium text-dark">Surname</label>
                <div className="mt-1 relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={surname}
                    onChange={clearOnChange(setSurname)}
                    className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter surname"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
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
                  onChange={clearOnChange(setEmail)}
                  className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">Password</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={clearOnChange(setPassword)}
                  className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">Confirm Password</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={clearOnChange(setConfirmPassword)}
                  className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Confirm password"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 py-2 text-white font-semibold shadow hover:opacity-90 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-dark">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                resetForm();
                goLogin?.();
              }}
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
