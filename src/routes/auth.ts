import { Router } from "express";
import { validateCookies } from "../middleware/validate-cookies";
import { AuthService } from "../services/auth";

// Auth Router
export const AuthRouter = Router();

// Middleware
AuthRouter.use(validateCookies);

/* 
    @GET refresh_token
*/
AuthRouter.get("/refresh_token", new AuthService().refreshToken);