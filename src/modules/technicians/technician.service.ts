import { prisma } from "../../lib/prisma";
// @ts-ignore
import { Prisma } from "../../generated/prisma";
import { TechnicianProfileWhereInput} from "../../../generated/prisma/models";

import {CreateTechnician, UpdateTechnician, ITechnicianQuery,IUpdateAvailability} from "./technician.interface";
import {UpdateBookingStatus} from "./technician.interface";
const createTechnician = async (
    userId: string,
    payload: CreateTechnician
) => {
    // Check user exists
    await prisma.users.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });

    // Check profile already exists
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
            bio: payload.bio,
            experience: payload.experience,
            hourlyRate: payload.hourlyRate,
            skills: payload.skills,
            nationalId: payload.nationalId,
            certification: payload.certification,
            userId,

            availability: payload.availability
                ? {
                    create: payload.availability.map((slot) => ({
                        dayOfWeek: slot.dayOfWeek,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                    })),
                }
                : undefined,
        },
    });

    return result;
};


const updateAvailability = async (
    userId: string,
    payload: IUpdateAvailability
) => {
    const { isAvailable, slots } = payload;

    const technician = await prisma.technicianProfile.findUnique({
        where: {
            userId,
        },
    });

    if (!technician) {
        throw new Error("Technician profile not found");
    }

    return prisma.$transaction(async (tx) => {
        await tx.technicianProfile.update({
            where: {
                id: technician.id,
            },
            data: {
                isAvailable,
            },
        });

        await tx.availabilitySlot.deleteMany({
            where: {
                technicianId: technician.id,
            },
        });

        if (slots && slots.length > 0) {
            await tx.availabilitySlot.createMany({
                data: slots.map((slot) => ({
                    technicianId: technician.id,
                    dayOfWeek: Number(slot.dayOfWeek),
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isAvailable: slot.isAvailable ?? true,
                })),
            });
        }

        return tx.technicianProfile.findUnique({
            where: {
                id: technician.id,
            },
            include: {
                availability: {
                    orderBy: [
                        {
                            dayOfWeek: "asc",
                        },
                        {
                            startTime: "asc",
                        },
                    ],
                },
            },
        });
    });
};

// Filter By:
// GET /api/technicians

const getAllTechnicians = async (query: ITechnicianQuery) => {
    const {
        searchTerm,
        location,
        category,
        experience,
        minRating,
        maxHourlyRate,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const andConditions: Prisma.TechnicianProfileWhereInput[] = [];

    // Search by technician name or bio
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    user: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    bio: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    // Filter by city
    if (location) {
        andConditions.push({
            user: {
                city: {
                    equals: location,
                    mode: "insensitive",
                },
            },
        });
    }

    // Filter by minimum experience
    if (experience) {
        andConditions.push({
            experience: {
                gte: Number(experience),
            },
        });
    }
    // Minimum Rating
    if (minRating) {
        andConditions.push({
            averageRating: {
                gte: Number(minRating),
            },
        });
    }

    // Filter by maximum hourly rate
    if (maxHourlyRate) {
        andConditions.push({
            hourlyRate: {
                lte: Number(maxHourlyRate),
            },
        });
    }
    // Filter by service category
    if (category) {
        andConditions.push({
            services: {
                some: {
                    category: {
                        name: {
                            equals: category,
                            mode: "insensitive",
                        },
                    },
                },
            },
        });
    }

    const where: Prisma.TechnicianProfileWhereInput =
        andConditions.length ? { AND: andConditions } : {};

    const technicians = await prisma.technicianProfile.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
            [sortBy]: sortOrder as Prisma.SortOrder,
        },
        include: {
            user: true,
            services: {
                include: {
                    category: true,
                },
            },
        },
    });

    const total = await prisma.technicianProfile.count({
        where,
    });

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: technicians,
    };
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
                    city: true,
                    district: true,
                    status: true,
                    isActive: true,
                },
            },

            availability: true,

            services: {
                where:{
                    isAvailable:true
                },
                include: {
                    category: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },

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

            _count: {
                select: {
                    services: true,
                    bookings: true,
                    reviews: true,
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

    const { availability, ...technicianData } = payload;

    return prisma.$transaction(async (tx) => {
        // Update technician profile
        await tx.technicianProfile.update({
            where: {
                userId,
            },
            data: {
                ...technicianData,
            },
        });

        // Update availability if provided
        if (availability) {
            await tx.availabilitySlot.deleteMany({
                where: {
                    technicianId: technician.id,
                },
            });

            if (availability.length > 0) {
                await tx.availabilitySlot.createMany({
                    data: availability.map((slot) => ({
                        technicianId: technician.id,
                        dayOfWeek: slot.dayOfWeek,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        isAvailable: slot.isAvailable ?? true,
                    })),
                });
            }
        }

        return tx.technicianProfile.findUnique({
            where: {
                userId,
            },
            include: {
                user: true,
                availability: true,
            },
        });
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

export const getTopRatedTechnicians = async () => {
    const technicians = await prisma.technicianProfile.findMany({
        where: {
            averageRating: {
                gt: 0,
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profileImage: true,
                },
            },
        },
        orderBy: {
            averageRating: "desc",
        },
    });

    return technicians;
};

const getBookingById = async (
    userId: string,
    bookingId: string
) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            userId,
        },
    });
    if (!technician) {
        throw new Error("Technician profile not found");
    }
    const booking = await prisma.booking.findFirst({
        where: {
            id: bookingId,

            // Important:
            // Only allow the assigned technician
            // to access this booking.
            technicianId: technician.id,
        },
        include: {
            customer: true,
            service: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    price: true,
                    duration: true,
                },
            },
        },
    });

    return booking;
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

// get My Technician Service

const getMyServices = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            userId,
        },
    });
    if (!technician) {
        throw new Error("Technician profile not found");
    }
    return prisma.service.findMany({
        where: {
            technicianId: technician.id,
        },
        include: {
                category: true,
                technician: {
                    select:{
                        id:true,
                        user:{
                            select:{
                                id:true,
                                name:true,
                            }
                        }
                    }
                },
            },
        orderBy: {
            createdAt: "desc",
        },
    });
};

const getMyAvailability = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            userId,
        },
    });
    if (!technician) {
        throw new Error("Technician profile not found");
    }
    return prisma.availabilitySlot.findMany({
        where: {
            technicianId: technician.id,
        },
        include:{
            technician: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};


const getDashboardOverview = async (userId: string) => {
    const technician = await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            userId,
        },
    });

    const technicianId = technician.id;

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );

    const [
        totalBookings,
        bookingsThisMonth,
        pendingRequests,
        todaysJobs,
        completedJobs,
        reviews,
        upcomingJobs,
        recentBookings,
        totalEarnings,
    ] = await Promise.all([
        // Total Bookings
        prisma.booking.count({
            where: {
                technicianId,
            },
        }),

        // Bookings created this month
        prisma.booking.count({
            where: {
                technicianId,
                createdAt: {
                    gte: startOfMonth,
                },
            },
        }),

        // Pending Requests
        prisma.booking.count({
            where: {
                technicianId,
                status: "REQUESTED",
            },
        }),

        // Today's Jobs
        prisma.booking.count({
            where: {
                technicianId,
                bookingDate: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
                status: {
                    in: [
                        "ACCEPTED",
                        "PAID",
                        "IN_PROGRESS",
                    ],
                },
            },
        }),

        // Completed Jobs
        prisma.booking.count({
            where: {
                technicianId,
                status: "COMPLETED",
            },
        }),

        // Reviews
        prisma.review.findMany({
            where: {
                booking: {
                    technicianId,
                },
            },
            select: {
                rating: true,
            },
        }),

        // Upcoming Jobs
        prisma.booking.findMany({
            where: {
                technicianId,
                bookingDate: {
                    gt: endOfToday,
                },
                status: {
                    in: [
                        "ACCEPTED",
                        "PAID",
                        "IN_PROGRESS",
                    ],
                },
            },
            include: {
                customer: true,
                service: true,
            },
            orderBy: {
                bookingDate: "asc",
            },
            take: 5,
        }),

        // Recent Bookings
        prisma.booking.findMany({
            where: {
                technicianId,
            },
            include: {
                customer: true,
                service: true,
                // review: true,
                // payments: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 5,
        }),

        // Total Earnings
        prisma.payment.aggregate({
            where: {
                booking: {
                    technicianId,
                },
                status: "COMPLETED",
            },
            _sum: {
                amount: true,
            },
        }),
    ]);

    // Average Rating
    const averageRating =
        reviews.length > 0
            ? reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0
              ) / reviews.length
            : 0;

    return {
        totalBookings,
        bookingsThisMonth,
        pendingRequests,
        todaysJobs,
        completedJobs,
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: reviews.length,
        totalEarnings: totalEarnings._sum.amount ?? 0,
        upcomingJobs,
        recentBookings,
    };
};
export const TechnicianService = {
    createTechnician,
    getAllTechnicians,
    getTopRatedTechnicians,
    getSingleTechnician,
    updateProfile,
    getMyBookings,
    updateBookingStatus,
    updateAvailability,
    getMyServices,
    getMyAvailability,
    getDashboardOverview,
    getBookingById
};