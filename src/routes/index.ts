import { Router } from "express";
import { AuthRouter } from "./auth";

// API route
export const router = Router();

/* 
    @Route collection
*/
router.use("/auth", AuthRouter);