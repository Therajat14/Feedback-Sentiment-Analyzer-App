import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "No authorization header provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId); // ✅ use req.userId from your authMiddleware

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // ✅ Proceed if user is admin
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
