import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import ApiError from "../utils/api.error.js";

export const validateRequest =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({ body: req.body });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.issues[0]?.message || "Validation failed";
        return next(new ApiError(errorMessage, 400));
      }
      next(error);
    }
  };
