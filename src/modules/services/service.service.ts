import { prisma } from "../../lib/prisma";
import { CreateServicePayload } from "./service.interface";
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

const getAllServices = async (query: any) => {
    const where: Prisma.ServiceWhereInput = {};

    if (query.type) {
        where.category = {
            name: {
                contains: query.type,
                mode: "insensitive",
            },
        };
    }

    if (query.location) {
        where.serviceArea = {
            contains: query.location,
            mode: "insensitive",
        };
    }

    if (query.rating) {
        where.technician = {
            averageRating: {
                gte: Number(query.rating),
            },
        };
    }

    return prisma.service.findMany({
        where,
        include: {
            category: true,
            technician: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const ServiceServices = {
    createService,
    //getServices,
    getAllServices,
};