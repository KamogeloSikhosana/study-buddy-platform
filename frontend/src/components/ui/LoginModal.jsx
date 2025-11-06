import { Dialog } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function LoginModal({ open, onClose, goSignup, goForgot }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add this line

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setError("");
      setLoading(false);
      setShowPassword(false); // Reset this too
    }
  }, [open]);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    setLoading(false);
    setShowPassword(false); // Reset this too
    onClose?.();
  };

  // In your handleLogin function - add these logs
// In your LoginModal handleLogin function
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await axios.post("http://localhost:3000/api/login", { 
      email, 
      password 
    });
    
    const userData = response.data;
    console.log("✅ [LoginModal] API Response:", userData);

    // Make sure the user data structure matches what AuthContext expects
    const userToSave = {
      id: userData.id,
      name: userData.name,
      email: email,
      role: userData.role, // This should be "student" or "admin"
      token: userData.token,
    };

    console.log("💾 [LoginModal] Saving user to context:", userToSave);
    login(userToSave);

    Swal.fire({
      icon: "success",
      title: `Welcome ${userData.name}!`,
      showConfirmButton: false,
      timer: 1500
    });

    handleClose();

    // Wait a moment for context to update, then redirect
    setTimeout(() => {
      if (userData.role === 'student') {
        console.log("➡️ [LoginModal] Redirecting to student dashboard");
        navigate('/studentdashboard', { replace: true });
      } else if (userData.role === 'admin') {
        console.log("➡️ [LoginModal] Redirecting to admin dashboard");
        navigate('/admindashboard', { replace: true });
      } else {
        console.log("⚠️ [LoginModal] Unknown role, redirecting home");
        navigate('/', { replace: true });
      }
    }, 100);

  } catch (err) {
    console.error("❌ [LoginModal] Login error:", err.response?.data);
    const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
    setError(errorMessage);

    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: errorMessage,
      confirmButtonColor: "#d33",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative w-full max-w-md rounded-2xl bg-white p-6 space-y-4 border border-white shadow-lg">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-dark/60 hover:text-blue-600 transition text-2xl leading-none cursor-pointer"
            aria-label="Close"
            disabled={loading}
          >
            ×
          </button>

          <div className="flex justify-center mb-4">
            <img src="/src/assets/logo.png" alt="Study Buddy Logo" className="h-24 w-auto" />
          </div>

          <p className="text-xl font-semibold text-center text-dark">Welcome to Study Buddy!</p>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">Email</label>
              <div className="mt-1 relative">
                {/* Email icon */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                  className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
                  placeholder="Enter email"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">Password</label>
              <div className="mt-1 relative">
                {/* Left lock icon */}
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>

                {/* Input with toggle */}
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                  className="w-full pl-9 pr-10 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 disabled:opacity-50"
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />

                {/* Eye toggle */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-dark transition-colors duration-200"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  disabled={loading}
                >
                  {showPassword ? (
                    // Eye Open
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 
                        7.51 7.36 4.5 12 4.5c4.638 
                        0 8.573 3.007 9.963 
                        7.178.07.207.07.431 0 
                        .639C20.577 16.49 16.64 19.5 
                        12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 
                        0 3 3 0 0 1 6 0Z" />
                    </svg>
                  ) : (
                    // Eye Slash
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 
                        0 1.934 12C3.226 16.338 7.244 
                        19.5 12 19.5c.993 
                        0 1.953-.138 
                        2.863-.395M6.228 
                        6.228A10.45 10.45 0 0 1 
                        12 4.5c4.756 0 8.773 
                        3.162 10.065 
                        7.5a10.523 10.523 0 0 
                        1-4.293 5.774M6.228 
                        6.228 3 3m3.228 
                        3.228 12.544 12.544" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline transition-colors duration-200"
                  onClick={goForgot}
                  disabled={loading}
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 py-3 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Logging in...
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-dark">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={goSignup}
              className="font-semibold text-blue-600 hover:underline cursor-pointer disabled:opacity-50"
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}