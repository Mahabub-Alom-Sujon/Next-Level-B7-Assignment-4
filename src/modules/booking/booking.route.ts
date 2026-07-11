import express from "express";

import { BookingControllers } from "./booking.controller";
import { auth } from "../../middlewares/auth";
import {UserRole} from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN,UserRole.CUSTOMER), BookingControllers.createBooking);

router.get("/", auth(UserRole.ADMIN,UserRole.CUSTOMER), BookingControllers.getMyBookings);

router.get("/:id", auth(UserRole.ADMIN,UserRole.CUSTOMER), BookingControllers.getBookingDetails);

export const BookingRoutes = router;