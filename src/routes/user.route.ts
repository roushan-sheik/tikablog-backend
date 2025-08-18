import { Router } from "express";
import type { Request, Response} from "express"

const router = Router();

/**
 * @openapi
 * tags:
 * name: Users
 * description: User authentication and management
 */

/**
 * @openapi
 * /api/v1/users/register:
 * post:
 * summary: Register a new user
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * format: password
 * responses:
 * 201:
 * description: User registered successfully
 */
router.post("/register", (req: Request, res: Response) => {
    const { name, email } = req.body;
    res.status(201).json({ message: "User registered successfully", user: { name, email } });
});

/**
 * @openapi
 * /api/v1/users/login:
 * post:
 * summary: Log in a user
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * format: email
 * password:
 * type: string
 * format: password
 * responses:
 * 200:
 * description: Login successful, returns a token
 */
router.post("/login", (req: Request, res: Response) => {
    res.status(200).json({ message: "Login successful", token: "dummy-jwt-token-string" });
});

/**
 * @openapi
 * /api/v1/users/profile:
 * get:
 * summary: Get current user's profile
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: User profile data
 */
router.get("/profile", (req: Request, res: Response) => {
    // এখানে সাধারণত authentication middleware থেকে user data পাওয়া যায়
    res.status(200).json({ id: 1, name: "Test User", email: "test@example.com" });
});

export const userRoutes = router;