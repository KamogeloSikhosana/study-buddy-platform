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

  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setError("");
    }
  }, [open]);

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    onClose?.();
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("http://localhost:3000/api/login", {
      email,
      password,
    });

    const user = response.data;
    console.log("🔍 Backend response:", user);

    // Test what happens when we call login
    console.log("🔄 Calling login with:", {
      id: user.id,
      name: user.name, 
      role: user.role,
      token: user.token
    });
    
    login({
      id: user.id,
      name: user.name,
      role: user.role,
      token: user.token,
    });

  

      // Redirect based on role
      if (user.role === "student") navigate("/studentdashboard", { replace: true });
      else if (user.role === "society-admin") navigate("/society-admin", { replace: true });
      else if (user.role === "admin") navigate("/admin", { replace: true });
      else navigate("/", { replace: true });

      handleClose();

      // Show welcome popup (simplified like the second version)
      Swal.fire({
        icon: "success",
        title: `Welcome ${user.name}!`,
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Something went wrong";
      setError(errorMessage);
      
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter email"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-dark">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter password"
                required
                autoComplete="current-password"
              />
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

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 py-2 text-white font-semibold hover:opacity-90 transition"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-dark">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={goSignup}
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