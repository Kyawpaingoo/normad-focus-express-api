import { User } from "@prisma/client";
import { LoginRequestDto, LoginResponseDto, RegisterUserDto } from '../dtos/userDtos';
import { JwtPayload } from "jsonwebtoken";
export declare const registerUser: (user: RegisterUserDto) => Promise<User>;
export declare const LoginUser: (loginDto: LoginRequestDto) => Promise<LoginResponseDto>;
export declare const refreshTokenPair: (token: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const verifyUser: (jwtUser: JwtPayload) => Promise<User>;
