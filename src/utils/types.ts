import { Request, Response } from "express";

export interface MContext {
    req: Request;
    res: Response;
    payload?: { id: number };
}