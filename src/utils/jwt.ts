import { Response } from "express"
import { sign, verify } from "jsonwebtoken"
import { User } from "../entities/User"

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
export const verifyToken = (token: string) => {
    return verify(token, process.env.ACCESS_TOKEN_KEY!) as any;
}