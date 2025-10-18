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
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validations
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        name,
        surname,
        email,
        password,
      });

      const { student_id, token } = response.data;

      // Save user in context (including token)
      login({
        id: student_id,
        name: `${name} ${surname}`,
        role: "student",
        token,
      });

      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "Account created successfully!",
        confirmButtonColor: "#3085d6",
      });

      handleClose();
      navigate("/studentdashboard", { replace: true });
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong";

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errorMsg,
        confirmButtonColor: "#d33",
      });

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const clearOnChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError("");
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

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
            <img
              src="/src/assets/logo.png"
              alt="Study Buddy Logo"
              className="h-30 w-auto"
            />
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
              <div className="relative">
                <label className="block text-sm font-medium text-dark">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={clearOnChange(setName)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-dark">
                  Surname
                </label>
                <input
                  type="text"
                  value={surname}
                  onChange={clearOnChange(setSurname)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter surname"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">Email</label>
              <input
                type="email"
                value={email}
                onChange={clearOnChange(setEmail)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter email"
                required
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={clearOnChange(setPassword)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter password"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={clearOnChange(setConfirmPassword)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Confirm password"
                required
                autoComplete="new-password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-2 font-semibold text-white shadow transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-400 hover:opacity-90"
              }`}
            >
              {loading ? "Signing up..." : "Sign Up"}
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
