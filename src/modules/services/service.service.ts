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
        category,
        location,
        rating,
        searchTerm,
        minPrice,
        maxPrice,
        page = "1",
        limit = "8",
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
    if (category) {
        andConditions.push({
            category: {
                name: {
                    equals: category,
                    mode: "insensitive",
                },
            },
        });
    }

    // Location Filter
    // if (location) {
    //     andConditions.push({
    //         serviceArea:{
    //             contains: location,
    //             mode: "insensitive",
    //         }
    //     })
    //
    // }

    // Filter by city
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
                        is: {
                            rating: {
                                equals: Number(rating),
                            },
                        },
                    },
                },
            },
        });
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
        andConditions.push({
            price: {
                ...(minPrice && {gte: Number(minPrice)}),
                ...(maxPrice && {lte: Number(maxPrice)}),
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
            // bookings: {
            //     where: {
            //         review: {
            //             is: {
            //                 rating: {
            //                     gte: Number(rating || 0),
            //                 },
            //             },
            //         },
            //     },
            //     include: {
            //         review: true,
            //     },
            // },
        },
    });

    const total = await prisma.service.count({
        where: whereConditions,
    });
    const totalPage = Math.ceil(total / limitNumber);
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage,
        },
        data: result,
    };
};


export const ServiceServices = {
    createService,
    getAllServices
};
