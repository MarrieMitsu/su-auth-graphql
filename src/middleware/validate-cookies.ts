import { NextFunction, Request, Response } from "express";

export const validateCookies = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const token = req.cookies.dir;

    if (!token) {
        res.status(401).send({ 
            status: false,
            message: "unauthorized" 
        });
    }

    next();
}