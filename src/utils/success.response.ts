import type{ Response } from "express";

// Interface for success response parameters
interface SuccessResponseParams {
    res: Response;
    code?: number;
    success?: boolean;
    message?: string;
    data?: any;
}

// Interface for the response body structure
interface SuccessResponseBody {
    success: boolean;
    message: string;
    code: number;
    data: any;
}

const successResponse = ({ res, code = 200, success = true, message = "", data = null }: SuccessResponseParams): Response<SuccessResponseBody> => {
    return res.status(code).json({
        success,
        message,
        code,
        data,
    });
};

export default successResponse;