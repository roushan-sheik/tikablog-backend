import { Router } from "express";
import { authControllers } from "../controllers/auth.controllers.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { userValidators } from "../validators/user.validator.js";

const router = Router();
router.post(
  "/register",
  validateRequest(userValidators.registerUser),
  authControllers.registerUser
);
router.post(
  "/login",
  validateRequest(userValidators.loginUser),
  authControllers.loginUser
);

export const userRoutes = router;
