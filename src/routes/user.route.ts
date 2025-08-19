import { Router } from "express";
import { authControllers } from "../controllers/auth.controllers.js";

 

const router = Router();
router.get("/",authControllers.getSingleUserById )

export const userRoutes = router;