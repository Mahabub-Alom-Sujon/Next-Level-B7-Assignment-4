import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import { jwtUtils } from "../utils/jwt";
import { UserRole } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import config from "../config";

declare global {
    namespace Express {
        interface Request {
            users?: {
                email: string;
                name: string;
                id: string;
                role: UserRole;
            };
        }
    }
}

export const auth = (...requiredRoles: UserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token =
            req.cookies.accessToken ??
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization);

        if (!token) {
            throw new Error("You are not logged in. Please log in to access this resource.");
        }

        const verifiedToken = jwtUtils.verifyToken(
            token,
            config.jwt_access_secret
        );

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }

        const { id, email, name, role } = verifiedToken.data as JwtPayload & {
            id: string;
            email: string;
            name: string;
            role: UserRole;
        };

        // Check user exists
        const user = await prisma.users.findUnique({
            where: {
                id,
            },
        });

        if (!user) {
            throw new Error("User not found. Please log in again.");
        }

        // Optional: verify token data matches database
        if (
            user.email !== email ||
            user.name !== name ||
            user.role !== role
        ) {
            throw new Error("Invalid token.");
        }

        // Check role
        if (
            requiredRoles.length > 0 &&
            !requiredRoles.includes(user.role)
        ) {
            throw new Error("Forbidden. You don't have permission to access this resource.");
        }

        req.users = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };

        next();
    });
};