import { Router } from "express";

import { TechnicianController} from "./technician.controller"
import {auth} from "../../middlewares/auth";
import {UserRole} from "../../../generated/prisma/enums";
const router = Router();

router.post("/create",auth(UserRole.ADMIN, UserRole.TECHNICIAN) , TechnicianController.createTechnician )
router.get("/", TechnicianController.getAllTechnicians);
router.get("/bookings", auth(UserRole.ADMIN,UserRole.TECHNICIAN), TechnicianController.getMyBookings);
router.get("/:id", TechnicianController.getSingleTechnician);
router.patch("/bookings/:id", auth(UserRole.ADMIN,UserRole.TECHNICIAN), TechnicianController.updateBookingStatus);
router.put("/profile", auth(UserRole.ADMIN,UserRole.TECHNICIAN), TechnicianController.updateProfile);
router.put("/availability", auth(UserRole.TECHNICIAN), TechnicianController.updateAvailability);
export const technicianRoutes = router;