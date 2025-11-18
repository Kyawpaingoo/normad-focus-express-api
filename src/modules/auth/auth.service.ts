import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../common/helpers/jwt.helper';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async registerUser(user: RegisterUserDto): Promise<User> {
    const { username, email, password, confirmPassword } = user;

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const hashedPwd = await this.hashedPassword(password);

    const result = await this.prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPwd,
        created_at: new Date(),
      },
    });

    if (!result) {
      throw new BadRequestException('User registration failed');
    }

    return result;
  }

  async loginUser(loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException('User password is missing');
    }

    const isPasswordValid = await this.validatePassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = generateAccessToken({ id: user.id, name: user.name });
    const refreshToken = generateRefreshToken({ id: user.id, name: user.name });

    const result = await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: refreshToken },
    });

    if (!result) {
      throw new BadRequestException('Failed to update user with refresh token');
    }

    return {
      accessToken,
      refreshToken,
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async refreshTokenPair(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    const decode: any = verifyRefreshToken(token);

    const user = await this.prisma.user.findFirst({
      where: { id: decode.id as number },
    });

    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = generateAccessToken({ id: user.id, name: user.name });
    const newRefreshToken = generateRefreshToken({ id: user.id, name: user.name });

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { refresh_token: newRefreshToken },
    });

    if (!updatedUser) {
      throw new BadRequestException('Failed to update user with new refresh token');
    }

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async verifyUser(jwtUser: JwtPayload): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id: jwtUser.id as number },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async hashedPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
