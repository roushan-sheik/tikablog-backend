import type{ Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import ApiError from "../utils/api.error.js";
 

// Error response interface
interface ErrorResponse {
    success: boolean;
    status: string;
    message: string;
    data: null;
    code: number;
    errors?: Array<{
        field: string;
        message: string;
        code?: string;
    }>;
    stack?: string;
    [key: string]: any; // For additional properties from ApiError
}

// Mongoose validation error interface
interface MongooseValidationError extends Error {
    errors: {
        [key: string]: {
            path: string;
            message: string;
        };
    };
}

// Mongoose cast error interface
interface MongooseCastError extends Error {
    path: string;
    value: any;
}

// MongoDB duplicate key error interface
interface MongoDuplicateKeyError extends Error {
    code: number;
    keyValue?: { [key: string]: any };
}

// JSON syntax error interface
interface JSONSyntaxError extends SyntaxError {
    status: number;
    body: any;
}

// 404 Not Found Middleware
export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    next(new ApiError(`Cannot find ${req.originalUrl} on this server`, 404));
};

// Global Error Handler Middleware
export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Default error response
    const errorResponse: ErrorResponse = {
        success: false,
        status: "error",
        message: "Something went wrong!",
        data: null,
        code: err.statusCode || 500,
    };
    
    // Prioritize status code from error
    let statusCode: number = err.statusCode || 500;

    // Handle ApiError instances
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        errorResponse.message = err.message;
        errorResponse.status = err.status || errorResponse.status;
        // Copy extra fields like `errors`
        Object.keys(err).forEach((key:string) => {
            if (!["message", "name", "stack", "isOperational", "statusCode"].includes(key)) {
                errorResponse[key] = (err as any)[key];
            }
        });
    }
    // Handle Zod validation errors
    else if (err instanceof ZodError) {
        statusCode = 400;
        errorResponse.status = "fail";
        errorResponse.message = "Validation failed";
        errorResponse.errors = err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
            code: issue.code,
        }));
    }
    // Handle Mongoose validation errors
    else if (err?.name === "ValidationError") {
        const mongooseErr = err as MongooseValidationError;
        statusCode = 400;
        errorResponse.status = "fail";
        errorResponse.message = "Validation failed";
        errorResponse.errors = Object.values(mongooseErr.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
    }
    // Handle CastError (invalid ID)
    else if (err?.name === "CastError") {
        const castErr = err as MongooseCastError;
        statusCode = 400;
        errorResponse.message = `Invalid ${castErr.path}: ${castErr.value}`;
        errorResponse.errors = [{ field: castErr.path, message: "Invalid ID format" }];
    }
    // Handle duplicate key errors (MongoDB)
    else if (err?.code === 11000) {
        const duplicateErr = err as MongoDuplicateKeyError;
        const key = Object.keys(duplicateErr.keyValue || {})[0];
        statusCode = 409;
        errorResponse.status = "fail";
        errorResponse.message = key ? `Duplicate value: ${key} must be unique` : "Duplicate key error";
        errorResponse.errors = key
            ? [{ field: key, message: `${key} must be unique` }]
            : [{ field: "unknown", message: "Duplicate field value entered" }];
    }
    // Handle JSON parsing errors
    else if (err instanceof SyntaxError && (err as JSONSyntaxError).status === 400 && "body" in err) {
        statusCode = 400;
        errorResponse.status = "fail";
        errorResponse.message = "Invalid JSON payload";
    }
    // Handle native JS errors
    else if (err instanceof Error) {
        errorResponse.message = err.message;
    }

    // Normalize final status code
    errorResponse.code = statusCode;
    if (!errorResponse.status) {
        errorResponse.status = statusCode >= 500 ? "error" : "fail";
    }

    // Include stack trace only in development
    if (process.env.NODE_ENV === "development" && err.stack) {
        errorResponse.stack = err.stack;
    }

    // Log error
    console.error(`[${new Date().toISOString()}] ${statusCode} - ${req.method} ${req.originalUrl}`, {
        message: errorResponse.message,
        code: statusCode,
        path: req.originalUrl,
        method: req.method,
        errors: errorResponse.errors,
        stack: errorResponse.stack,
    });

    // Send response
    res.status(statusCode).json(errorResponse);
};

// Zod Validation Middleware (now throws ApiError, defers to global handler)
export const validateZod = (schema: ZodType, source: "body" | "query" | "params" = "body") => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const data = req[source];

            if (!data) {
                return next(new ApiError(`No data found in request ${source}`, 400));
            }

            req[source] = schema.parse(data);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const formattedErrors = err.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                    code: issue.code,
                }));

                next(
                    new ApiError("Validation failed", 400, {
                        errors: formattedErrors,
                    })
                );
            } else {
                next(err);
            }
        }
    };
};