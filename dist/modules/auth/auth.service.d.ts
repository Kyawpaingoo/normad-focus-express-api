import { PrismaService } from '../../database/prisma.service';
import { User } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from 'jsonwebtoken';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    registerUser(user: RegisterUserDto): Promise<User>;
    loginUser(loginDto: LoginRequestDto): Promise<LoginResponseDto>;
    refreshTokenPair(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyUser(jwtUser: JwtPayload): Promise<User>;
    private hashedPassword;
    private validatePassword;
}
