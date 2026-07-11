import express from "express";
import { PaymentController } from "./payment.controller";
import {auth} from "../../middlewares/auth";
import {UserRole} from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/create", auth("CUSTOMER"), PaymentController.createPayment);

router.post("/confirm", PaymentController.confirmPayment);
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    PaymentController.handleWebhook
);

router.get("/", auth(UserRole.ADMIN,UserRole.CUSTOMER), PaymentController.getPayments);

router.get("/:id", auth(UserRole.ADMIN,UserRole.CUSTOMER), PaymentController.getPayment);

export const PaymentRoutes = router;