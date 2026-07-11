import { Router } from "express";
import { ReviewControllers } from "./review.controller";
import {auth} from "../../middlewares/auth";
import {UserRole} from "../../../generated/prisma/enums";
const router = Router();

router.post("/", auth(UserRole.CUSTOMER), ReviewControllers.createReview);

export const ReviewRoutes = router;