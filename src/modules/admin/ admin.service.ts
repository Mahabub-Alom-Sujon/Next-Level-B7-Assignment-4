import {prisma} from "../../lib/prisma";
import {CreateCategory} from "./admin.interface";

const getAllUsers = async () => {
    return prisma.users.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });
};

const updateUserStatus = async (
    id: string,
    status: "ACTIVE" | "BLOCKED"
) => {
    return prisma.users.update({
        where: {
            id,
        },
        data: {
            status,
        },
        omit:{
            password: true,
            profileImage: true,
        }
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

export const adminService = {
    getAllUsers,
    getAllBookings,
    updateUserStatus,
    getAllCategories,
    createCategory,
}