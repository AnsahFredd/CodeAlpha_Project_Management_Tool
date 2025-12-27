import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

interface ErrorWithStatus extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: any;
  errors?: any;
}

/**
 * Global error handling middleware
 * Catches all errors and formats them consistently
 */
export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { ...error, message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = `Duplicate field value: ${field}. Please use another value.`;
    error = { ...error, message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const mongooseErr = err as mongoose.Error.ValidationError;
    const message = Object.values(mongooseErr.errors)
      .map((val) => val.message)
      .join(", ");
    error = { ...error, message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    error = { ...error, message, statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired. Please log in again.";
    error = { ...error, message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
