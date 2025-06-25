import prisma from "./../prisma";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { LoginRequestDto, LoginResponseDto, RegisterUserDto } from '../dtos/userDtos';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./../utils/jwtHelper";
import { JwtPayload } from "jsonwebtoken";
import { refreshToken } from '../controller/authController';

export const registerUser = async (user: RegisterUserDto) : Promise<User> => {
    const {username, email, password, confirmPassword} = user;

    const exisitingUser = await prisma?.user.findFirst({ 
            where: {
                email: email 
            } 
    });

    if(exisitingUser) throw new Error("User already exists with this email");

    if(password !== confirmPassword) throw new Error("Passwords do not match");

    if(password.length < 6) throw new Error("Password must be at least 6 characters long");

    const hashedPwd = await hashedPassword(password);

    const result: User = await prisma.user.create({
        data: {
            name: username,
            email,
            password: hashedPwd,
            created_at: new Date(),
        }
    });

    if (!result) {
        throw new Error("User registration failed");
    }
    return result;
}

export const LoginUser = async (loginDto: LoginRequestDto): Promise<LoginResponseDto> => {
    const {email, password} = loginDto;

    const user = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.password) {
        throw new Error("User password is missing");
    }

    const isPasswordValid = await ValidetePassword(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }
    
    const accessToken = generateAccessToken({ id: user.id, name: user.name });
    const refreshToken = generateRefreshToken({ id: user.id, name: user.name });

    //console.log(accessToken);
    const result = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            refresh_token: refreshToken
        }
    });

    if (!result) {
        throw new Error("Failed to update user with refresh token");
    }

    return { accessToken, refreshToken, userId: user.id, username: user.name };
}

export const refreshTokenPair = async (token: string) : Promise<{accessToken: string, refreshToken: string}> => {
    const decode: any = verifyRefreshToken(token);

    const user = await prisma.user.findFirst({
        where: {
            id: decode.id as number,
        }
    });

    if(!user || !user.refresh_token) {
        throw new Error("Invalid refresh token");
    }

    const newAccessToken = generateAccessToken({ id: user.id, name: user.name });
    const newRefreshToken = generateRefreshToken({ id: user.id, name: user.name });

    const updatedUser = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            refresh_token: newRefreshToken
        }
    });

    if (!updatedUser) {
        throw new Error("Failed to update user with new refresh token");
    }

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}


export const verifyUser = async (jwtUser: JwtPayload) : Promise<User> => {
    const decode: any = await verifyRefreshToken(jwtUser.refreshToken as string);

    const user: User | null = await prisma.user.findFirst({
        where: {
            id: decode.id as number,
        }
    });

    if(!user)
    {
        throw new Error("User not found");
    }

    return user;
}

const hashedPassword = (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
}

const ValidetePassword = (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}