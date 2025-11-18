import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginRequestDto } from './dto/login-request.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(loginDto: LoginRequestDto, res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyUser(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
