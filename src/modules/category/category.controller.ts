import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { CategoryServices } from "./category.service";

const getCategories = catchAsync(async (req, res) => {
    const result = await CategoryServices.getCategories();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Categories retrieved successfully",
        data: result,
    });
});

export const CategoryControllers = {
    getCategories,
};