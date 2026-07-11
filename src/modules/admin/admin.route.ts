import { Router } from "express";
import { AdminController } from "./ admin.controller";
import { auth } from "../../middlewares/auth.js";
import {UserRole} from "../../../generated/prisma/enums";

const router = Router();

router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);

router.patch(
    "/users/:id",
    auth(UserRole.ADMIN),
    AdminController.updateUserStatus
);

router.get(
    "/bookings",
    auth(UserRole.ADMIN),
    AdminController.getAllBookings
);

router.get(
    "/categories",
    auth(UserRole.ADMIN),
    AdminController.getAllCategories
);

router.post(
    "/categories",
    auth(UserRole.ADMIN),
    AdminController.createCategory
);

export const adminRoutes = router;