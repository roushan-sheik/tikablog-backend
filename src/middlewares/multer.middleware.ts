import type{ Request } from 'express';
import multer from 'multer';

// Custom error interface for file upload errors
interface FileUploadError extends Error {
    status?: number;
}

const ALLOWED_MIME_TYPES: string[] = [
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    "application/octet-stream",
    'image/vnd.microsoft.icon'
];

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
): void => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error: FileUploadError = new Error('Invalid file type. Only image and video files are allowed.');
        error.status = 400;
        cb(error, false);
    }
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
    fileFilter,
});

export default upload;