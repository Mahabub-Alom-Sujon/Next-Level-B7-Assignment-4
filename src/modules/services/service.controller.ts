import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { ServiceServices } from "./service.service";
import httpStatus from "http-status";

const createService = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ServiceServices.createService(req.body);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Service created successfully",
        data: result,
    });
});

const getAllServices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await ServiceServices.getAllServices(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Services retrieved successfully",
        data: result,
    });
});

const getSingleServiceById = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{

    const serviceId = req.params.id;
    const getServiceDetails = await ServiceServices.getSingleService(serviceId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service Details patched successfully",
        data: getServiceDetails,
    });
})

export const ServiceControllers = {
    createService,
    getSingleServiceById,
    getAllServices,
};