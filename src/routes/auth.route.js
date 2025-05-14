import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  verifyEmail,
  forgetPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/checkAuth", protectedRoute, checkAuth);
authRouter.post("/verifyEmail", verifyEmail);
authRouter.post("/forgetPassword", forgetPassword);
authRouter.post("/resetPassword/:token", resetPassword);

export default authRouter;
