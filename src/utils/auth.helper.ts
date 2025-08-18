import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import type { NextFunction } from 'express';
import ApiError from "./api.error.js";

// Configuration interface
interface OTPConfig {
    expiresMinutes: number;
}

// User interface for validation methods
interface User {
    isDeleted?: boolean;
    verify_otp?: boolean;
    isActive?: boolean;
    otpExpires?: Date | number;
    passwordResetExpires?: Date | number;
}

// Token payload interface
interface TokenPayload {
    id: string;
    email: string;
    isPatient?: boolean;
    isProvider?: boolean;
    isAdmin?: boolean;
}

// Email and OTP validation interface
interface EmailOTPData {
    email: string;
    otp: string;
}

const OTP_CONFIG: OTPConfig = {
    expiresMinutes: 30,
};

class AuthHelper {
    /**
     * Generate JWT token
     */
    static generateToken({ id, email, isPatient = false, isProvider = false, isAdmin = false }: TokenPayload): string {
        const jwtSecret = process.env.JWT_SECRET;
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN;
        
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const payload = { id, email, isPatient, isProvider, isAdmin };

        if (jwtExpiresIn) {
            const options: jwt.SignOptions = { expiresIn: jwtExpiresIn as any };
            return jwt.sign(payload, jwtSecret, options);
        } else {
            return jwt.sign(payload, jwtSecret);
        }
    }

    /**
     * Generate numeric OTP of specified length
     */
    static generateOTP(length: number = 4): string {
        const min = 10 ** (length - 1);
        const max = 10 ** length - 1;
        return Math.floor(min + Math.random() * (max - min + 1)).toString();
    }

    /**
     * Hash a string using SHA256
     */
    static hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    /**
     * Validate that an email is in correct format and lowercase
     */
    static isValidEmail(email: string): boolean {
        return !!email && /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);
    }

    /**
     * Check if a timestamp has expired
     */
    static isExpired(timestamp: Date | number | null | undefined): boolean {
        return !timestamp || (typeof timestamp === 'object' ? timestamp.getTime() : timestamp) < Date.now();
    }

    /**
     * Calculate minutes remaining until a future timestamp
     */
    static minutesUntil(futureTime: Date | number): number {
        const futureTimeMs = typeof futureTime === 'object' ? futureTime.getTime() : futureTime;
        return Math.ceil((futureTimeMs - Date.now()) / (60 * 1000));
    }

    /**
     * Validate the presence and format of email & OTP
     */
    static validateEmailAndOTP({ email, otp }: EmailOTPData, next: NextFunction): void {
        if (!email || !otp) return next(new ApiError('Email and OTP are required!', 400));
        if (!this.isValidEmail(email)) return next(new ApiError('Invalid email format.', 400));
    }

    /**
     * Validate email only
     */
    static validateEmail(email: string, next: NextFunction): void {
        if (!email) return next(new ApiError('Email is required', 400));
        if (!this.isValidEmail(email)) return next(new ApiError('Invalid email format.', 400));
    }

    /**
     * Validate user account state
     */
    static validateUserActive(user: User | null, next: NextFunction): void {
        if (!user) return next(new ApiError('User not found', 400));
        if (user.isDeleted) return next(new ApiError('Account has been deleted', 400));
        if (user.verify_otp) return next(new ApiError("Account is already verified", 409));
        if (user.isActive) return next(new ApiError('User account is already active', 400));
        return next(new ApiError("Please verify your account before logging in.", 400));
    }

    /**
     * Check if OTP resend is allowed
     */
    static checkOtpResendAllowed(user: User, next: NextFunction): void {
        if (user.otpExpires && this.isExpired(user.otpExpires) === false) {
            const minutesLeft = this.minutesUntil(user.otpExpires);
            return next(new ApiError(`Please wait ${minutesLeft} minute(s) before requesting a new OTP`, 429));
        }
    }

    /**
     * Check if the password reset token is still valid
     */
    static checkPasswordResetTokenExpiry(user: User, next: NextFunction): void {
        if (user.passwordResetExpires && this.isExpired(user.passwordResetExpires) === false) {
            return next(new ApiError('You already have a valid reset token. Please use that or wait until it expires.', 429));
        }
    }

    /**
     * Generate OTP expiry timestamp
     */
    static generateOTPExpiry(minutes: number = OTP_CONFIG.expiresMinutes): Date {
        return new Date(Date.now() + minutes * 60 * 1000);
    }
}

export default AuthHelper;