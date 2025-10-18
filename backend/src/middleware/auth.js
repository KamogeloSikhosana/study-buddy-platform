// src/middleware/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Named export for authenticateToken
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log("=== AUTHENTICATION MIDDLEWARE ===");
  console.log("Authorization header:", req.headers['authorization']);
  console.log("Token extracted:", token ? "Yes" : "No");
  
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verification failed:", err.message);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    console.log("JWT verified for user:", user);
    req.user = user;
    next();
  });
};

// Named export for authMiddleware (alias for compatibility)
export const authMiddleware = authenticateToken;

// Default export
export default { authenticateToken, authMiddleware };