import { Router } from "express";
import * as AuthController from '../controller/authController';
import { auth } from "../middleware/authMiddleware";

const authRouter = Router();    

authRouter.post('/register', AuthController.register); // Register user route
authRouter.post('/login', AuthController.login); // Login user route
authRouter.get('/refresh-token', AuthController.refreshToken); // Refresh token route
authRouter.get('/verify-user', auth, AuthController.verifyUser); // Verify user route

export default authRouter;