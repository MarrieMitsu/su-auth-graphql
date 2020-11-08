import { Request, Response } from "express";
import { User } from "../entities/User";
import { createAccessToken, createRefreshToken, sendRefreshToken, verifyToken } from "../utils/jwt";

// Auth service
export class AuthService {

    // Refresh token
    async refreshToken(req: Request, res: Response): Promise<Response> {
        const token = req.cookies.dir;

        try {
            let payload = verifyToken(token, "refresh");
            
            const user = await User.findOne(payload.id);
            if (!user) {
                return res.status(201).send({
                    status: false,
                    message: "user not found",
                    accessToken: "",
                });
            }

            sendRefreshToken(res, createRefreshToken(user));

            return res.status(201).send({
                status: true,
                message: "success",
                accessToken: createAccessToken(user),
            });

        } catch (err) {
            return res.status(201).send({
                status: false,
                message: "invalid signature",
                accessToken: "",
            });
        }

    }

}