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
            bookingTime: payload.bookingTime,
            address: payload.address,
            note: payload.note,
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
// Bookings Customer
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
const getOverviewCustomer = async (customerId: string) => {
    const [
        totalBookings,
        requestedBookings,
        acceptedBookings,
        completedBookings,
        recentBookings,
    ] = await Promise.all([
        prisma.booking.count({
            where: {
                customerId,
            },
        }),

        prisma.booking.count({
            where: {
                customerId,
                status: "REQUESTED",
            },
        }),

        prisma.booking.count({
            where: {
                customerId,
                status: "ACCEPTED",
            },
        }),

        prisma.booking.count({
            where: {
                customerId,
                status: "COMPLETED",
            },
        }),

        prisma.booking.findMany({
            where: {
                customerId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),
    ]);

    return {
        totalBookings,
        requestedBookings,
        acceptedBookings,
        completedBookings,
        recentBookings,
    };
};
export const BookingServices = {
    createBooking,
    getMyBookings,
    getBookingDetails,
    getOverviewCustomer
};