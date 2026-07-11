import { BookingServices } from "./booking.service";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";

const createBooking = catchAsync(async (req, res) => {

    const result = await BookingServices.createBooking(
        req.users?.id as string,
        req.body
    );

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Booking created successfully",
        data: result,
    });
});

const getMyBookings = catchAsync(async (req, res) => {

    const result = await BookingServices.getMyBookings(
        req.users?.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Bookings retrieved successfully",
        data: result,
    });
});

const getBookingDetails = catchAsync(async (req, res) => {

    const result = await BookingServices.getBookingDetails(
        req.params.id as string,
        req.users?.id as string,
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Booking retrieved successfully",
        data: result,
    });
});

export const BookingControllers = {
    createBooking,
    getMyBookings,
    getBookingDetails,
};