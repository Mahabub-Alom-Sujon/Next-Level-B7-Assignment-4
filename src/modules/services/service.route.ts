import { Router } from "express";
import { ServiceControllers } from "./service.controller";
import { auth } from "../../middlewares/auth";
import {UserRole} from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(UserRole.ADMIN),  ServiceControllers.createService);
router.get("/", ServiceControllers.getAllServices);
router.get("/:id", ServiceControllers.getSingleServiceById)

export const ServiceRoutes = router;