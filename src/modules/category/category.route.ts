import { Router } from "express";
import { CategoryControllers } from "./category.controller";

const router = Router();

router.get("/", CategoryControllers.getCategories);

export const CategoryRoutes = router;