import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// middlewares
import { errorHandler } from "./src/middlewares/error.middleware.js";
// routes
import userRoutes from "./src/routes/user.routes.js";
// utils
import connectCloudinary from "./src/config/cloudinary.js";
import connectDB from "./src/config/db.js";

connectDB();
connectCloudinary();

const app = express();

const PORT = process.env.PORT || 5001;

// middlware for cors
const corsOptions = {
  origin: ["http://localhost:5173"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
// middleware to parse json body from http request
app.use(express.json());
// middleware to parse form data from http request
app.use(express.urlencoded({ extended: true }));
// middleware to parse cookies from http request
app.use(cookieParser());

// routes middleware
app.use("/api/v1/users", userRoutes);
// error handler middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
