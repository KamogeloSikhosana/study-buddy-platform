// ProtectedRoute.jsx - TEMPORARY DEBUG VERSION
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user, isAuthenticated, initializing } = useAuth();

  useEffect(() => {
    console.log("🔐 [ProtectedRoute] Mounted with:", {
      initializing,
      isAuthenticated,
      user,
      localStorageUser: localStorage.getItem("user"),
      localStorageToken: localStorage.getItem("token")
    });
  }, []);

  console.log("🔐 [ProtectedRoute] Render with:", {
    initializing,
    isAuthenticated,
    user,
    hasUser: !!user,
    userRole: user?.role
  });

  if (initializing) {
    console.log("⏳ [ProtectedRoute] Still initializing...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // TEMPORARY: Add more permissive check for debugging
  const hasLocalStorageUser = localStorage.getItem("user");
  const hasLocalStorageToken = localStorage.getItem("token");
  
  console.log("🔐 [ProtectedRoute] LocalStorage check:", {
    hasLocalStorageUser: !!hasLocalStorageUser,
    hasLocalStorageToken: !!hasLocalStorageToken
  });

  if (!isAuthenticated && hasLocalStorageUser && hasLocalStorageToken) {
    console.log("⚠️ [ProtectedRoute] Context says not authenticated but localStorage has user - this is the bug!");
    console.log("🔧 [ProtectedRoute] Allowing access anyway for debugging");
    // Continue to render children for debugging
  } else if (!isAuthenticated) {
    console.log("❌ [ProtectedRoute] Not authenticated, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("✅ [ProtectedRoute] User authenticated, rendering protected content");
  return children;
}