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

export const ReviewControllers = {
    createReview,
};