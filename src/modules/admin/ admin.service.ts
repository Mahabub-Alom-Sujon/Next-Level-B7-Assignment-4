import {prisma} from "../../lib/prisma";
import {CreateCategory, Query} from "./admin.interface";
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


// const getAllBookings = async () => {
//     return prisma.booking.findMany({
//         include: {
//             customer: true,
//             technician: {
//                 include: {
//                     user: true,
//                 },
//             },
//             service: true,
//         },
//         orderBy: {
//             createdAt: "desc",
//         },
//     });
// };

const getAllBookings = async (query: Query) => {
    const {
        page = "1",
        limit = "10",
        searchTerm = "",
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereCondition = {
        ...(searchTerm && {
            OR: [
                {
                    customer: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                },
                {
                    customer: {
                        email: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                },
                {
                    technician: {
                        user: {
                            name: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                    },
                },
                {
                    service: {
                        title: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                },
                // ...(isNaN(Number(searchTerm))
                //     ? []
                //     : [
                //         {
                //             totalPrice: Number(searchTerm),
                //         },
                //     ]),
            ],
        }),
    };

    const [bookings, total] = await prisma.$transaction([
        prisma.booking.findMany({
            where: whereCondition,
            skip,
            take: limitNumber,
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
        }),

        prisma.booking.count({
            where: whereCondition,
        }),
    ]);

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },
        data: bookings,
    };
};

const createCategory = async (payload: CreateCategory) => {
    return prisma.category.createMany({
        data: payload,
    });
};

const getAllCategories = async (query: Query) => {
    const {
        page = "1",
        limit = "10",
        searchTerm = "",
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereCondition = {
        ...(searchTerm && {
            OR:[
                {
                    name:{
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    }
                },
                {
                    description:{
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    }
                }
            ]

        }),
    };

    const [categories, total] = await prisma.$transaction([
        prisma.category.findMany({
            where: whereCondition,
            skip,
            take: limitNumber,
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.category.count({
            where: whereCondition,
        }),
    ]);

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },
        data: categories,
    };
};

const getAllService = async (query: Query) => {
    const {
        page = "1",
        limit = "10",
        searchTerm = "",
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereCondition = {
        isAvailable: true,
        ...(searchTerm && {
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    },
                },
                {
                    category: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive" as const,
                        },
                    },
                },
                {
                    technician: {
                        user: {
                            name: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                    },
                },
                ...(isNaN(Number(searchTerm))
                    ? []
                    : [
                        {
                            price: Number(searchTerm),
                        },
                    ]),
            ],
        }),
    };

    const [services, total] = await prisma.$transaction([
        prisma.service.findMany({
            where: whereCondition,
            skip,
            take: limitNumber,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                technician: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        bookings: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.service.count({
            where: whereCondition,
        }),
    ]);

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },
        data: services,
    };
};

// const getAllTechnicians = async () => {
//     const where = {
//         isAvailable: true,
//     };
//
//     const [technicians, total] = await prisma.$transaction([
//         prisma.technicianProfile.findMany({
//             where,
//             include: {
//                 user: {
//                     select: {
//                         id: true,
//                         name: true,
//                         email: true,
//                         phone: true,
//                         profileImage: true,
//                         role: true,
//                         createdAt: true,
//                     },
//                 },
//                 // _count: {
//                 //     select: {
//                 //         services: true,
//                 //         bookings: true,
//                 //         reviews: true,
//                 //     },
//                 // },
//             },
//             orderBy: {
//                 createdAt: "desc",
//             },
//         }),
//
//         prisma.technicianProfile.count({
//             where,
//         }),
//     ]);
//
//     return {
//         total,
//         technicians,
//     };
// };

const getAllTechnicians = async (query: Query) => {
    const {
        page = "1",
        limit = "10",
        searchTerm = "",
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereCondition = {
        isAvailable: true,
        ...(searchTerm && {
            OR: [
                {
                    skills: {
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    },
                },
                {
                    bio: {
                        contains: searchTerm,
                        mode: "insensitive" as const,
                    },
                },
                {
                    user: {
                        is: {
                            name: {
                                contains: searchTerm,
                                mode: "insensitive" as const,
                            },
                        },
                    },
                },
                ...(isNaN(Number(searchTerm))
                    ? []
                    : [
                        {
                            hourlyRate: Number(searchTerm),
                        },
                    ]),
            ]
        }),
    };

    const [technicians, total] = await prisma.$transaction([
        prisma.technicianProfile.findMany({
            where: whereCondition,
            skip,
            take: limitNumber,
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
                _count: {
                    select: {
                        services: true,
                        bookings: true,
                        reviews: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.technicianProfile.count({
            where: whereCondition,
        }),
    ]);

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },
        data: technicians,
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