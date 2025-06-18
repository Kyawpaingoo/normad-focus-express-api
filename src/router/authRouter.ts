import { Router } from "express";
import * as AuthController from '../controller/authController';

const authRouter = Router();    

authRouter.post('/register', AuthController.register); // Register user route
authRouter.post('/login', AuthController.login); // Login user route
authRouter.post('/refresh-token', AuthController.refreshToken); // Refresh token route

export default authRouter;