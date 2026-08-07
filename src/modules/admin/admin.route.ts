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

//GET /api/services
// GET /api/services?page=2&limit=10
// GET /api/services?searchTerm=plumbing
//GET /api/services?page=1&limit=9&searchTerm=electrician
router.get(
    "/services",
    auth(UserRole.ADMIN),
    AdminController.getAllServices
);
router.get(
    "/technician",
    auth(UserRole.ADMIN),
    AdminController.getAllTechnicians
);

router.get(
    "/dashboard",
    auth("ADMIN"),
    AdminController.getDashboardOverview
);

export const adminRoutes = router;