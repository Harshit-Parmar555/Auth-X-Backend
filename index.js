// File: index.js
// Description: This is the entry point of the backend application. It sets up the server, connects to the database, and configures middleware and routes.

// dotenv config
import dotenv from "dotenv";
dotenv.config();

// Importing required modules
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Database connection function
import { connectDb } from "./src/db/connect.js";

// Express App
const app = express();

// Frontend URL
const frontendUrl =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL
    : "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Logger config
import morgan from "morgan";
import logger from "./src/utils/logger.js";

// Commented out morgan logger format due to storage issue

// const morganFormat = ":method :url :status :response-time ms";
// app.use(
//   morgan(morganFormat, {
//     stream: {
//       write: (message) => {
//         const logObject = {
//           method: message.split(" ")[0],
//           url: message.split(" ")[1],
//           status: message.split(" ")[2],
//           responseTime: message.split(" ")[3],
//         };
//         logger.info(JSON.stringify(logObject));
//       },
//     },
//   })
// );

// PORT
const PORT = process.env.PORT || 4000;

// Routes
import authRouter from "./src/routes/auth.route.js";

app.use("/api/v1/auth", authRouter);

// App listening
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
