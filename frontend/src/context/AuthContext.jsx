// AuthContext.jsx - Fix the initialization
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      console.log("🔄 [AuthContext] Initializing from localStorage:", {
        hasStoredUser: !!storedUser,
        hasToken: !!token
      });
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          console.log("📥 [AuthContext] Loaded user from storage:", parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      // Add a small delay to ensure state is set
      setTimeout(() => {
        setInitializing(false);
        console.log("🏁 [AuthContext] Initialization complete");
      }, 100);
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    console.log("💾 [AuthContext] Login called with:", userData);
    setUser(userData);
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("✅ [AuthContext] User saved to context and localStorage");
  };

  const logout = () => {
    console.log("🚪 [AuthContext] Logging out");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Compute values for easy access
  const isAuthenticated = !!user;
  const role = user?.role;
  const dashboardPath = role === "student" ? "/studentdashboard" : 
                       role === "admin" ? "/admindashboard" : null;

  console.log("🎯 [AuthContext] Current state:", {
    user,
    isAuthenticated,
    role,
    dashboardPath
  });

  return (
    <AuthContext.Provider value={{ 
      user,
      role,
      initializing,
      isAuthenticated,
      dashboardPath,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};