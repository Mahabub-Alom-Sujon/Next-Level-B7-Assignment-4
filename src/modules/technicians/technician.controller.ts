import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { TechnicianService, } from "./technician.service";
import {prisma} from "../../lib/prisma.ts";

const createTechnician = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.users?.id as string;
        const payload = req.body;

        const result = await TechnicianService.createTechnician(
            userId,
            payload
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Technician profile created successfully",
            data: result,
        });
    }
);

const getAllTechnicians = catchAsync(async (req, res) => {
    const result = await TechnicianService.getAllTechnicians(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technicians retrieved successfully",
        data: result,
    });
});

const updateAvailability = catchAsync(
    async (req: Request, res: Response) => {
        const id = req.users?.id as string;
        const result = await TechnicianService.updateAvailability(
            id,
            req.body
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Availability updated successfully",
            data: result,
        });
    }
);

const getSingleTechnician = catchAsync(async (req, res) => {
    const result = await TechnicianService.getSingleTechnician(
        req.params.id as string,
    );
    sendResponse(res, {
        success: true,
        statusCode : httpStatus.OK,
        message: "Technician retrieved successfully",
        data: result,
    });
});

const updateProfile = catchAsync(async (req, res) => {
    const userId = req.users!.id;
    const result = await TechnicianService.updateProfile(
        userId,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technician profile updated successfully",
        data: result,
    });
});

const getMyBookings = catchAsync(async (req, res) => {
    const userId = req.users?.id as string;
    const result = await TechnicianService.getMyBookings(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technician bookings retrieved successfully",
        data: result,
    });
});

const updateBookingStatus = catchAsync(async (req, res) => {
    const result = await TechnicianService.updateBookingStatus(
        req.users?.id as string,
        req.params.id as string,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Booking status updated successfully",
        data: result,
    });
});


const getMyServices = catchAsync(async (req, res) => {
    const userId = req.users?.id as string;
    const result = await TechnicianService.getMyServices(userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technician bookings retrieved successfully",
        data: result,
    });
});

const getMyAvailability = catchAsync(async (req, res) => {
    const userId = req.users?.id as string;
    const result = await TechnicianService.getMyAvailability(userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technician bookings retrieved successfully",
        data: result,
    });
});

const getDashboardOverview = catchAsync(async (req, res) => {
    const userId = req.users?.id as string;
    const result = await TechnicianService.getDashboardOverview(userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Technician bookings retrieved successfully",
        data: result,
    });
});

export const TechnicianController = {
    createTechnician,
    getAllTechnicians,
    getSingleTechnician,
    updateProfile,
    getMyBookings,
    updateBookingStatus,
    updateAvailability,
    getMyServices,
    getMyAvailability,
    getDashboardOverview
};