import { Controller, Post, Get, Body, Res, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto, @Res() res: Response) {
    try {
      const user = await this.authService.registerUser(registerDto);
      const { id, name, email } = user;
      return res.status(HttpStatus.OK).json({
        success: true,
        data: { id, name, email },
        msg: 'User registered successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: error.message,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginRequestDto, @Res() res: Response) {
    try {
      const response = await this.authService.loginUser(loginDto);
      const { id, name, email, accessToken, refreshToken } = response;

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        secure: false,
        sameSite: 'lax',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: 'lax',
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        data: { id, name, email },
        msg: 'User logged in successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: error.message,
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  @Get('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.cookies.refreshToken as string;
      if (!token) {
        throw new Error('Token not found in cookies');
      }

      const { accessToken, refreshToken } = await this.authService.refreshTokenPair(token);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        secure: false,
        sameSite: 'lax',
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: false,
        sameSite: 'lax',
      });

      return res.status(HttpStatus.OK).json({
        success: true,
        data: null,
        msg: 'Token refreshed successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        error: error.message,
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  @Get('verify-user')
  @UseGuards(JwtAuthGuard)
  async verifyUser(@Req() req: any, @Res() res: Response) {
    try {
      const user = await this.authService.verifyUser(req.user);
      const { id, name, email } = user;
      return res.status(HttpStatus.OK).json({
        success: true,
        data: { id, name, email },
        msg: 'User verified successfully',
      });
    } catch (error: any) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        error: error.message,
        status: HttpStatus.FORBIDDEN,
      });
    }
  }
}
