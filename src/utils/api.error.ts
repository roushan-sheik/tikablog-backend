class ApiError extends Error {
    public statusCode: number;
    public status: string;
    public success: boolean;
    public data: null;
    public isOperational: boolean;

    constructor(message: string, statusCode: number = 500, metadata: Record<string, any> = {}) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("5") ? "error" : "fail";
        this.success = false;
        this.data = null;
        Object.assign(this, metadata);
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
    }
}

export default ApiError;