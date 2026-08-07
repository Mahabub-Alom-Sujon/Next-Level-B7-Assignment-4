import {prisma} from "../../lib/prisma";
import {CreateCategory} from "./admin.interface";
import {BookingStatus} from "../../../generated/prisma/enums.ts";

const getAllUsers = async () => {
    return prisma.users.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include:{
            technician:true,
        }
        // select: {
        //     id: true,
        //     name: true,
        //     email: true,
        //     phone: true,
        //     profileImage: true,
        //     role: true,
        //     status: true,
        //     createdAt: true,
        // },

    });
};

const updateUserStatus = async (
    id: string,
    status: "ACTIVE"  | "BLOCKED"
) => {
    const isBanned = status === "BLOCKED";

    return prisma.users.update({
        where: {
            id,
        },
        data: {
            status,
            isBanned,
        },
        omit: {
            password: true,
            profileImage: true,
        },
    });
};


const getAllBookings = async () => {
    return prisma.booking.findMany({
        include: {
            customer: true,
            technician: {
                include: {
                    user: true,
                },
            },
            service: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

const getAllCategories = async () => {
    return prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
};

const createCategory = async (payload: CreateCategory) => {
    return prisma.category.createMany({
        data: payload,
    });
};

const getAllService = async () => {
    const where = {
        isAvailable: true,
    };
    const [services, total] = await prisma.$transaction([
        prisma.service.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.service.count({
            where,
        }),
    ]);
    return {
        total,
        services,
    };
};

const getAllTechnicians = async () => {
    const where = {
        isAvailable: true,
    };

    const [technicians, total] = await prisma.$transaction([
        prisma.technicianProfile.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        profileImage: true,
                        role: true,
                        createdAt: true,
                    },
                },
                // _count: {
                //     select: {
                //         services: true,
                //         bookings: true,
                //         reviews: true,
                //     },
                // },
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.technicianProfile.count({
            where,
        }),
    ]);

    return {
        total,
        technicians,
    };
};

const getDashboardOverview = async () => {
    const [
        totalUsers,
        totalTechnicians,
        totalBookings,
        totalRevenue,
        pendingBookings,
        activeTechnicians,
        recentBookings,
    ] = await prisma.$transaction([
        prisma.users.count(),

        prisma.technicianProfile.count(),

        prisma.booking.count(),

        prisma.payment.aggregate({
            where: {
                status: "COMPLETED",
            },
            _sum: {
                amount: true,
            },
        }),

        prisma.booking.count({
            where: {
                status: BookingStatus.REQUESTED,
            },
        }),

        prisma.technicianProfile.count({
            where: {
                isAvailable: true,
            },
        }),

        prisma.booking.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                customer: {
                    select: {
                        name: true,
                    },
                },
                service: {
                    select: {
                        title: true,
                        price: true,
                    },
                },
            },
        }),
    ]);

    return {
        overview: {
            totalUsers,
            totalTechnicians,
            totalBookings,
            totalRevenue: totalRevenue._sum.amount ?? 0,
            pendingBookings,
            activeTechnicians,
        },
        recentBookings,
    };
};

export const adminService = {
    getAllUsers,
    getAllBookings,
    updateUserStatus,
    getAllCategories,
    createCategory,
    getAllService,
    getAllTechnicians,
    getDashboardOverview
}