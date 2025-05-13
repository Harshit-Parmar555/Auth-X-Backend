import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Jwt token generate function
export const generateJwt = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expiration set to 7 days
  });

  return token;
};
