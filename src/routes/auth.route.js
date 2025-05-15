// Importing necessary modules
import express from "express";

// Importing required controllers
import {
  checkAuth,
  login,
  logout,
  verifyEmail,
  forgetPassword,
  resetPassword,
  register,
} from "../controllers/auth.controller.js";

// Importing required middlewares
import { protectedRoute } from "../middlewares/auth.js";

// Creating an instance of express Router
const authRouter = express.Router();

// Defining routes for authentication
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/checkAuth", protectedRoute, checkAuth);
authRouter.post("/verifyEmail", verifyEmail);
authRouter.post("/forgetPassword", forgetPassword);
authRouter.post("/resetPassword/:token", resetPassword);

export default authRouter;
