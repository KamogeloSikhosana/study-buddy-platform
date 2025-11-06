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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetForm = () => {
    setName("");
    setSurname("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setLoading(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const isPasswordStrong = () => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*]/.test(password)
    );
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
                    className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                    placeholder="Enter name"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-dark">
                  Surname
                </label>
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
                    className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
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
                  className="w-full pl-9 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="Enter email"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">
                Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={clearOnChange(setPassword)}
                  className="w-full pl-9 pr-10 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="Enter password"
                  required
                  autoComplete="new-password"
                />

                {/* Eye toggle */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-dark transition-colors duration-200"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
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

              {/* Password Requirements */}
              {password && !isPasswordStrong() && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center ${password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="w-4 mr-2">
                        {password.length >= 8 ? '✓' : '○'}
                      </span>
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="w-4 mr-2">
                        {/[A-Z]/.test(password) ? '✓' : '○'}
                      </span>
                      1 uppercase letter (A-Z)
                    </div>
                    <div className={`flex items-center ${/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="w-4 mr-2">
                        {/[a-z]/.test(password) ? '✓' : '○'}
                      </span>
                      1 lowercase letter (a-z)
                    </div>
                    <div className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="w-4 mr-2">
                        {/[0-9]/.test(password) ? '✓' : '○'}
                      </span>
                      1 number (0-9)
                    </div>
                    <div className={`flex items-center ${/[!@#$%^&*]/.test(password) ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="w-4 mr-2">
                        {/[!@#$%^&*]/.test(password) ? '✓' : '○'}
                      </span>
                      1 special character (!@#$%^&* etc.)
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={clearOnChange(setConfirmPassword)}
                  className="w-full pl-9 pr-10 rounded-lg border border-gray-300 px-3 py-2 text-dark text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="Confirm password"
                  required
                  autoComplete="new-password"
                />

                {/* Eye toggle */}
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-dark transition-colors duration-200"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
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
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-3 font-semibold text-white shadow-lg hover:shadow-xl transform transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-400 hover:scale-[1.02]"
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
              className="font-semibold text-blue-600 hover:underline cursor-pointer transition-colors duration-200"
            >
              Login
            </button>
          </p>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}