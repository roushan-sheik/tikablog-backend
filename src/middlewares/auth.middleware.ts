import type { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catch.async.js";
import ApiError from "../utils/api.error.js";
import jwt from "jsonwebtoken";
import User from "../schemas/opeartion/user.schema.js";

// User interface that matches your database model
interface UserDocument {
  id: string;
  role?: string;
  changedPasswordAfter(timestamp: number): boolean;
  [key: string]: any;
}

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

// JWT payload interface
interface JWTPayload {
  id: string;
  iat: number;
  exp: number;
}

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return next(new ApiError("Unauthorized: No token provided", 401));

    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (error) {
      return next(new ApiError("Unauthorized: Invalid or expired token", 401));
    }

    const user = await User.findById(decoded.id).select("+passwordChangedAt");
    if (!user) return next(new ApiError("User no longer exists", 401));

    if (user.changedPasswordAfter(decoded.iat)) {
      return next(
        new ApiError("Password changed recently. Please log in again", 401)
      );
    }

    req.user = user;
    next();
  }
);

// Role-based restriction middleware
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ApiError(`Access denied. Only ${roles.join(" or ")} allowed.`, 403)
      );
    }
    next();
  };
};
