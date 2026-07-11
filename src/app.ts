import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { notFoundHandler } from "./middlewares/not-found";
import { globalErrorHandler } from "./middlewares/global-error";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.routes";
import { technicianRoutes } from "./modules/technicians/technician.route"
import { adminRoutes } from "./modules/admin/admin.route";
import {BookingRoutes} from "./modules/booking/booking.route";
import {ServiceRoutes} from "./modules/services/service.route";
import { CategoryRoutes } from "./modules/category/category.route";
import {ReviewRoutes} from "./modules/review/review.route";
import {PaymentRoutes} from "./modules/payment/payment.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(
    "/api/payments/webhook",
    express.raw({ type: "application/json" })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 1. All your actual API Routes go here
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.use("/api/auth", userRoutes, authRoutes);
//app.use("/api/auth", authRoutes)
app.use("/api/services", ServiceRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/payments", PaymentRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/technicians", technicianRoutes)
app.use("/api/reviews", ReviewRoutes);
app.use("/api/admin", adminRoutes)

// 2. ⚠️ THE NOT FOUND MIDDLEWARE (Catches anything that didn't match above)
app.use(notFoundHandler);

// 3. Global Error Handler (Catches server crashes/thrown errors)
app.use(globalErrorHandler);

export default app;
