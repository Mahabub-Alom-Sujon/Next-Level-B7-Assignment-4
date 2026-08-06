import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catch-async.js";
import { sendResponse } from "../../utils/send-response.js";
import { adminService } from "./ admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUsers();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Users retrieved successfully",
        data: result,
    });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.updateUserStatus(
        req.params.id as string,
        req.body.status
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User status updated successfully",
        data: result,
    });
});

const getAllBookings = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllBookings();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Bookings retrieved successfully",
        data: result,
    });
});

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllCategories();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories retrieved successfully",
        data: result,
    });
});

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.createCategory(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: result,
    });
});

const getAllServices=catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllService();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Services retrieved successfully",
        data: result,
    });
})

const getAllTechnicians=catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllTechnicians();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technicians retrieved successfully",
        data: result,
    });
})

const getDashboardOverview = catchAsync(async (req, res) => {
    const result = await adminService.getDashboardOverview();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Dashboard overview retrieved successfully",
        data: result,
    });
});


export const AdminController = {
    getAllUsers,
    updateUserStatus,
    getAllBookings,
    getAllCategories,
    createCategory,
    getAllServices,
    getAllTechnicians,
    getDashboardOverview
};