import { Router, type Application } from "express";
import { userRoutes } from "./user.route.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

const routes = [{ path: "/users", route: userRoutes }];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export const mountRoutes = (app: Application) => {
  app.use("/api/v1", router);
};
