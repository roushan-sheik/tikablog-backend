import { Router } from "express";
import type { Request, Response} from "express"

const router = Router();

/**
 * @openapi
 * tags:
 * name: Products
 * description: API for managing products
 */

/**
 * @openapi
 * /api/v1/products:
 * get:
 * summary: Get a list of all products
 * tags: [Products]
 * responses:
 * 200:
 * description: A list of products.
 */
router.get("/", (req: Request, res: Response) => {
    res.status(200).json([
        { id: 1, name: "Laptop", price: 80000 },
        { id: 2, name: "Mouse", price: 1200 },
    ]);
});

/**
 * @openapi
 * /api/v1/products/{id}:
 * get:
 * summary: Get a single product by ID
 * tags: [Products]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * description: The product ID
 * responses:
 * 200:
 * description: Product data
 * 404:
 * description: Product not found
 */
router.get("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).json({ id: parseInt(id), name: `Product ${id}`, price: Math.random() * 1000 });
});

/**
 * @openapi
 * /api/v1/products:
 * post:
 * summary: Create a new product
 * tags: [Products]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * price:
 * type: number
 * responses:
 * 201:
 * description: Product created successfully.
 */
router.post("/", (req: Request, res: Response) => {
    const { name, price } = req.body;
    res.status(201).json({ success: true, message: "Product created", data: { id: Date.now(), name, price } });
});

/**
 * @openapi
 * /api/v1/products/{id}:
 * patch:
 * summary: Update an existing product
 * tags: [Products]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * price:
 * type: number
 * responses:
 * 200:
 * description: Product updated successfully.
 */
router.patch("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Product ${id} updated.` });
});

/**
 * @openapi
 * /api/v1/products/{id}:
 * delete:
 * summary: Delete a product
 * tags: [Products]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Product deleted successfully.
 */
router.delete("/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Product ${id} deleted.` });
});


export const productRoutes = router;