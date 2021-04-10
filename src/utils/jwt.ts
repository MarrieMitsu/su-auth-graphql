import { Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from "../entities/User";

// Type
type verifyType = "access" | "refresh" | "forgot-password";

// Create forgot password token
export const createForgotPasswordToken = (user: User): string => {
    return sign(
        { id: user.id },
        process.env.FORGOT_PASSWORD_TOKEN_KEY!,
        { expiresIn: "15m" }
    );
}

// Create access token
export const createAccessToken = (user: User): string => {
    return sign(
        { id: user.id },
        process.env.ACCESS_TOKEN_KEY!,
        { expiresIn: "5m" }
    )
}

// Create refresh token
export const createRefreshToken = (user: User): string => {
    return sign(
        { id: user.id },
        process.env.REFRESH_TOKEN_KEY!,
        { expiresIn: "7d" }
    );
}

// Send refresh token
export const sendRefreshToken = (res: Response, token: string): void => {
    res.cookie('dir', token, {
        httpOnly: true,
    })
}

// Verify token
export const verifyToken = (token: string, type: verifyType): any => {
    let env: string;
    if (type === "access") {
        env = process.env.ACCESS_TOKEN_KEY!;
    } else if (type === "refresh") {
        env = process.env.REFRESH_TOKEN_KEY!;
    } else if (type === "forgot-password") {
        env = process.env.FORGOT_PASSWORD_TOKEN_KEY!;
    }

    return verify(
        token, 
        env!
    ) as any;
}