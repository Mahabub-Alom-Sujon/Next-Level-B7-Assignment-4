import { prisma } from "../../lib/prisma";
import {CreateBookingPayload } from "./booking.interface"

const createBooking = async (
    customerId: string,
    payload: CreateBookingPayload
) => {

    // Check technician

    await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            id: payload.technicianId,
        },
    });

    // Check Service

    await prisma.service.findUniqueOrThrow({
        where: {
            id: payload.serviceId,
        },
    });

    const booking = await prisma.booking.create({
        data: {
            bookingDate: new Date(payload.bookingDate),
            customerAddress: payload.customerAddress,
            note: payload.note,
            totalAmount: payload.totalAmount,
            customerId,
            technicianId: payload.technicianId,
            serviceId: payload.serviceId,
        },

        include: {
            customer: true,
            technician: true,
            service: true,
        },
    });

    return booking;
};

const getMyBookings = async (customerId: string) => {
    return prisma.booking.findMany({
        where: {
            customerId,
        },

        include: {
            technician: true,
            service: true,
            payments: true,
            review: true,
        },

        orderBy: {
            createdAt: "desc",
        },
    });
};

const getBookingDetails = async (
    bookingId: string,
    customerId: string
) => {

    return prisma.booking.findFirstOrThrow({
        where: {
            id: bookingId,
            customerId,
        },

        include: {
            customer: true,
            technician: true,
            service: true,
            payments: true,
            review: true,
        },
    });
};

export const BookingServices = {
    createBooking,
    getMyBookings,
    getBookingDetails,
};