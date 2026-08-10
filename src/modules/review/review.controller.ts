import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { ReviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
    const result = await ReviewServices.createReview(
        req.users!.id,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Review created successfully",
        data: result,
    });
});

const getMyReviews = catchAsync(async (req, res) => {

    const result = await ReviewServices.getMyReviews(
        req.users?.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Review retrieved successfully",
        data: result,
    });
});

export const ReviewControllers = {
    createReview,
    getMyReviews
};