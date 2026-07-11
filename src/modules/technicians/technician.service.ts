import { prisma } from "../../lib/prisma";
// @ts-ignore
import { Prisma } from "../../../generated/prisma";
import { TechnicianProfileWhereInput} from "../../../generated/prisma/models";

import {CreateTechnician, UpdateAvailabilityPayload, UpdateTechnician} from "./technician.interface";
import { TechnicianQuery } from "./technician.interface";
import {UpdateBookingStatus} from "./technician.interface";
const createTechnician = async ( userId: string, payload: CreateTechnician ) => {
    // User exists কিনা
    await prisma.users.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });

    // Profile already exists কিনা
    const existingProfile = await prisma.technicianProfile.findUnique({
        where: {
            userId,
        },
    });

    if (existingProfile) {
        throw new Error("Technician profile already exists.");
    }

    const result = await prisma.technicianProfile.create({
        data: {
            ...payload,
            userId,
        },
    });

    return result;
};

const getAllTechnicians = async (query: TechnicianQuery) => {
    const where: Prisma.TechnicianProfileWhereInput = {};

    // Filter by service area (location)
    if (query.location) {
        where.services = {
            some: {
                serviceArea: {
                    contains: query.location,
                    mode: "insensitive",
                },
            },
        };
    }

    // Filter by average rating
    if (query.rating) {
        where.averageRating = {
            gte: Number(query.rating),
        };
    }

    const result = await prisma.technicianProfile.findMany({
        where,
        include: {
            services: {
                include: {
                    category: true,
                },
            },
            bookings: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

const updateAvailability = async (
    userId: string,
    payload: UpdateAvailabilityPayload
) => {
    // Find technician
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            userId,
        },
    });

    const result = await prisma.availability.upsert({
        where: {
            technicianId: technician.id,
        },
        update: {
            availableDays: payload.availableDays,
            startTime: payload.startTime,
            endTime: payload.endTime,
        },
        create: {
            technicianId: technician.id,
            availableDays: payload.availableDays,
            startTime: payload.startTime,
            endTime: payload.endTime,
        },
    });

    return result;
};

const getSingleTechnician = async (id: string) => {
    const result = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    profileImage: true,
                    address: true,
                },
            },
            //services: true,
            reviews: {
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            profileImage: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    return result;
};

const updateProfile = async (
    userId: string,
    payload: UpdateTechnician
) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId,
        },
    });

    if (!technician) {
        throw new Error("Technician profile not found");
    }

    return prisma.technicianProfile.update({
        where: {
            userId,
        },
        data: payload,
    });
};

const getMyBookings = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            userId,
        },
    });
    if (!technician) {
        throw new Error("Technician profile not found");
    }
    return prisma.booking.findMany({
        where: {
            technicianId: technician.id,
        },
        include: {
            customer: true,
            service: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
const updateBookingStatus = async (
    userId: string,
    bookingId: string,
    payload: UpdateBookingStatus
) => {
    // Find technician profile
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            userId,
        },
    });

    // Find booking
    const booking = await prisma.booking.findUniqueOrThrow({
        where: {
            id: bookingId,
        },
    });

    // Ensure booking belongs to this technician
    if (booking.technicianId !== technician.id) {
        throw new Error("You are not authorized to update this booking.");
    }

    // Update booking status
    const result = await prisma.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: payload.status,
        },
        include: {
            customer: true,
            service: true,
            technician: {
                include: {
                    user: true,
                },
            },
        },
    });

    return result;
};

export const TechnicianService = {
    createTechnician,
    getAllTechnicians,
    getSingleTechnician,
    updateProfile,
    getMyBookings,
    updateBookingStatus,
    updateAvailability,
};