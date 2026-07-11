import { prisma } from "../../lib/prisma";

const getCategories = async () => {
    return await prisma.category.findMany({
        include:{
            services:true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const CategoryServices = {
    getCategories,
};