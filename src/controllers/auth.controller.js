// Importing necessary modules
import bcrypt from "bcrypt";

// user model
import { User } from "../models/user.model.js";

// JWT utility function
import { generateJwt } from "../utils/jwt.js";

// Email functions
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} from "../mailer/mailer.js";

// Checking environment
const isProduction = process.env.NODE_ENV === "production";

// Register controller
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await newUser.save();

    const token = await generateJwt(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await sendVerificationEmail(newUser.email, verificationToken);

    return res
      .status(200)
      .json({ success: true, message: "User Created Successfully" });
  } catch (error) {
    if (error.code === 11000) {
      // Handling MongoDB duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${
          field === "username" ? "Username" : "Email"
        } is already taken. Try a different one.`,
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Email not verified" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = generateJwt(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const resUser = await User.findOne({ email }).select("-password");
    return res
      .status(200)
      .json({ success: true, message: "Login successfull", user: resUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout controller
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// CheckAuth controller
export const checkAuth = async (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: false, message: "Authenticated", user: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify email controller
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token not provided" });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.username);

    return res
      .status(200)
      .json({ success: true, message: "Email verfied successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Forget password controller
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email not provided" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found with this email" });
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/resetpassword/${resetToken}`
    );

    return res.status(200).json({ success: true, message: "Email sent !" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Password reset controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Credentials not provided" });
    }

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    if (
      user.resetPasswordTokenExpiresAt &&
      user.resetPasswordTokenExpiresAt < Date.now()
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Reset token has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);

    return res
      .status(200)
      .json({ success: true, message: "Password Changed Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
