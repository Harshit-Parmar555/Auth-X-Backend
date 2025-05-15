// Importing necessary modules
import jwt from "jsonwebtoken";

// user model
import { User } from "../models/user.model.js";

// Protected route for auth
export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Not Authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ success: false, message: "Invalid Token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
