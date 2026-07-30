import { prisma } from "../../lib/prisma";
import { CreateServicePayload } from "./service.interface";
import {IServiceQuery } from "./service.interface"
// @ts-ignore
import { Prisma } from "../../../generated/prisma";
import {Query} from "pg";
const createService = async (payload: CreateServicePayload) => {
    // Check technician
    await prisma.technicianProfile.findUniqueOrThrow({
        where: {
            id: payload.technicianId,
        },
    });

    // Check category
    await prisma.category.findUniqueOrThrow({
        where: {
            id: payload.categoryId,
        },
    });

    return prisma.service.create({
        data: payload,
    });
};
// const getServices = async () => {
//     return prisma.service.findMany({
//         include: {
//             technician: true,
//             category: true,
//         },
//         orderBy: {
//             createdAt: "desc",
//         },
//     });
// };

const getAllServices = async (query: IServiceQuery) => {
    const {
        type,
        location,
        rating,
        searchTerm,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const andConditions: Prisma.ServiceWhereInput[] = [];

    // Search
    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    // Category Filter
    if (type) {
        andConditions.push({
            category: {
                name: {
                    equals: type,
                    mode: "insensitive",
                },
            },
        });
    }

    // Location Filter
    if (location) {
        andConditions.push({
            technician: {
                user: {
                    city: {
                        equals: location,
                        mode: "insensitive",
                    },
                },
            },
        });
    }

    // Rating Filter
    if (rating) {
        andConditions.push({
            bookings: {
                some: {
                    review: {
                        rating: {
                            gte: Number(rating),
                        },
                    },
                },
            },
        });
    }

    const whereConditions: Prisma.ServiceWhereInput =
        andConditions.length ? { AND: andConditions } : {};

    const result = await prisma.service.findMany({
        where: whereConditions,
        skip,
        take: limitNumber,
        orderBy: {
            [sortBy]: sortOrder as Prisma.SortOrder,
        },
        include: {
            category: true,
            technician: {
                include: {
                    user: true,
                },
            },
            bookings: {
                include: {
                    review: true,
                },
            },
        },
    });

    const total = await prisma.service.count({
        where: whereConditions,
    });

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
        },
        data: result,
    };
};


// const getAllServices = async (query: any) => {
//     const where: Prisma.ServiceWhereInput = {};
//
//     if (query.type) {
//         where.category = {
//             name: {
//                 contains: query.type,
//                 mode: "insensitive",
//             },
//         };
//     }
//
//     if (query.location) {
//         where.serviceArea = {
//             contains: query.location,
//             mode: "insensitive",
//         };
//     }
//
//     if (query.rating) {
//         where.technician = {
//             averageRating: {
//                 gte: Number(query.rating),
//             },
//         };
//     }
//
//     return prisma.service.findMany({
//         where,
//         include: {
//             category: true,
//             technician: {
//                 include: {
//                     user: true,
//                 },
//             },
//         },
//         orderBy: {
//             createdAt: "desc",
//         },
//     });
// };

export const ServiceServices = {
    createService,
    //getServices,
    getAllServices
};