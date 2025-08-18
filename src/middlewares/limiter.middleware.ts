import type { Request, Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// Extend Request interface for user property (if not already extended)
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                [key: string]: any;
            };
        }
    }
}

// 1. Global IP-based limiter
export const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
    keyGenerator: (req: Request): string => ipKeyGenerator(req), // IPv6 safe
    message: 'Too many requests from this IP. Try again later.',
});

// 2. Login attempt limiter
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    keyGenerator: (req: Request): string => ipKeyGenerator(req),
    message: 'Too many failed logins. Try again later.',
});

// 3. Seller-specific limiter
export const providerLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 50,
    keyGenerator: (req: Request): string => req.user?.id || ipKeyGenerator(req),
    message: 'Too many seller actions. Slow down!',
});

// 4. Buyer-specific limiter
export const patientCheckoutLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    keyGenerator: (req: Request): string => ipKeyGenerator(req),
    message: 'Too many checkout attempts. Wait a minute.',
});

// 5. Public API limiter
export const publicApiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5000,
    skip: (req: Request): boolean => req.path === '/api/products',
    keyGenerator: (req: Request): string => ipKeyGenerator(req),
});

// 6. Admin-specific limiter
export const adminLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    keyGenerator: (req: Request): string => req.user?.id || ipKeyGenerator(req),
    message: 'Too many admin requests. Slow down!',
});