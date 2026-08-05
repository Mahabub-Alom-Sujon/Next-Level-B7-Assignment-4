import { prisma } from "../../lib/prisma";
import { CreateServicePayload } from "./service.interface";
import {IServiceQuery } from "./service.interface"
// @ts-ignore
import { Prisma } from "../../../generated/prisma";
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

    return prisma.service.createMany({
        data: payload,
    });
};
const getAllServices = async (query: IServiceQuery) => {
    const {
        category,
        location,
        rating,
        searchTerm,
        minPrice,
        maxPrice,
        page = "1",
        limit = "9",
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

    let orderBy: Prisma.ServiceOrderByWithRelationInput;

    switch (sortBy) {
        case "price":
            orderBy = {
                price: sortOrder as Prisma.SortOrder,
            };
            break;

        case "rating":
            orderBy = {
                technician: {
                    averageRating: "desc",
                },
            };
            break;

        default:
            orderBy = {
                createdAt: sortOrder as Prisma.SortOrder,
            };
    }

    const result = await prisma.service.findMany({
        where: whereConditions,
        skip,
        take: limitNumber,
        orderBy,
        // orderBy: {
        //     [sortBy]: sortOrder as Prisma.SortOrder,
        // },
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
            }
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

const getSingleService = async (serviceId: string) => {
    const getSingleService = await prisma.service.findUnique({
        where: {
            id: serviceId,
        },
        include: {
            category: true,
            technician:{
                select:{
                    id:true,
                    bio:true,
                    experience:true,
                    hourlyRate:true,
                    skills:true,
                    certification:true,
                    averageRating:true,
                    totalReviews:true,
                    completedJobs:true,
                    user: { select: { id: true, name: true, profileImage: true } },
                }
            },
            bookings:{
                where:{
                    isAvailable:true
                }
            }
        }
    });

    return getSingleService;
};

export const ServiceServices = {
    createService,
    getAllServices,
    getSingleService
};
