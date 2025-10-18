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

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setError("");
      setLoading(false);
    }
  }, [open]);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    setLoading(false);
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
        <Dialog.Panel className="relative w-full max-w-md rounded-2xl bg-white p-6 space-y-4">
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
            <div className="relative">
              <label className="block text-sm font-medium text-dark">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="Enter email"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                placeholder="Enter password"
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline disabled:opacity-50"
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
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 py-2 text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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