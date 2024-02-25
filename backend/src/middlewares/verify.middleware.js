import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { AppError } from "../utils/AppError.js";

export const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      throw new AppError(401, "Access token not provided");
    }

    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "Invalid Access token");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        throw new AppError(403, "User is not authorized to access resources");
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(new AppError(error.statusCode, error.message));
    }
    next(new Error(error.message));
  }
};
