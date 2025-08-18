import type{ Request, Response, NextFunction } from "express";

// Type for async Express middleware/controller functions
type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<any>;

// Type for the returned middleware function
type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;

export default function catchAsync(fn: AsyncMiddleware): MiddlewareFunction {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err: any) => {
      console.log(err);
      next(err);
    });
  };
}