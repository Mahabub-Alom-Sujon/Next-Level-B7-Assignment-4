import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { ServiceServices } from "./service.service";
import httpStatus from "http-status";

const createService = catchAsync(async (req, res) => {
    const result = await ServiceServices.createService(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Service created successfully",
        data: result,
    });
});

// const getServices = catchAsync(async (req, res) => {
//     const result = await ServiceServices.getServices();
//
//     sendResponse(res, {
//         success: true,
//         statusCode: 200,
//         message: "Services retrieved successfully",
//         data: result,
//     });
// });
const getAllServices = catchAsync(async (req, res) => {
    const result = await ServiceServices.getAllServices(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Services retrieved successfully",
        data: result,
    });
});
export const ServiceControllers = {
    createService,
    //getServices,
    getAllServices,
};