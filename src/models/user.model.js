import mongoose from "mongoose";

// User schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Provide Username"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Provide Email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please Provide Password"],
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
  },
  { timestamps: true }
);

// User model
export const User = mongoose.model("user", userSchema);
