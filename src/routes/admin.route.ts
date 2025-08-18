import { Router } from "express";

import type { Request, Response} from "express"
const router = Router();

/**
 * @openapi
 * tags:
 * name: Admin
 * description: Admin-only operations
 */

/**
 * @openapi
 * /api/v1/admin/dashboard:
 * get:
 * summary: Get dashboard statistics
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Dashboard data
 */
router.get("/dashboard", (req: Request, res: Response) => {
    res.status(200).json({
        totalUsers: 150,
        totalProducts: 45,
        pendingOrders: 12,
    });
});

/**
 * @openapi
 * /api/v1/admin/users:
 * get:
 * summary: Get a list of all users (for admin)
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: A list of all registered users
 */
router.get("/users", (req: Request, res: Response) => {
    res.status(200).json([
        { id: 1, name: "User One", email: "one@example.com", role: "user" },
        { id: 2, name: "User Two", email: "two@example.com", role: "user" },
    ]);
});

/**
 * @openapi
 * /api/v1/admin/users/{id}/ban:
 * post:
 * summary: Ban a user
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: The ID of the user to ban
 * responses:
 * 200:
 * description: User banned successfully
 */
router.post("/users/:id/ban", (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `User ${id} has been banned.` });
});

export const adminRoutes = router;