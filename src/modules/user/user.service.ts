import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import {RegisterUserPayload} from "./user.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) =>{
    const { name, email, password, phone, profileImage } = payload;
    const isUserExist = await prisma.users.findUnique({
        where: { email }
    })

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))

    const createdUser = await prisma.users.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phone,
            profileImage
        }
    })
    const user = await prisma.users.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email || email
        },
        omit: {
            password: true
        },
    })

    return user;
}

const getMyProfileFromDB = async (userId : string) => {
    const user = await prisma.users.findUniqueOrThrow({
        where : {id : userId},
        omit : {
            password : true
        },
    });

    return user;
}

export const  userService ={
    registerUserIntoDB,
    getMyProfileFromDB
}