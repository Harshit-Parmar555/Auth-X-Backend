import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.get("/checkAuth", protectedRoute, checkAuth);
authRouter.post("/verifyEmail", verifyEmail);

export default authRouter;
