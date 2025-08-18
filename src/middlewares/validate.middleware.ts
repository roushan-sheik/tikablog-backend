import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import ApiError from "../utils/api.error.js";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessage = error.issues[0]?.message || "Validation failed";
            return next(new ApiError(errorMessage, 400));
        }
        next(error);
    }
};