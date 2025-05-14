import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateJwt } from "../utils/jwt.js";

// Signup controller
export const signup = async (req, res) => {
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
