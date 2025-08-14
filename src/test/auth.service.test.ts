import { LoginResponseDto, RegisterUserDto, LoginRequestDto } from '../dtos/userDtos';
import prisma from '../prisma'
import { JwtPayload } from 'jsonwebtoken';
import * as AuthService from '../service/authService';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockImplementation((password, hash) => Promise.resolve(password === 'testPassword' && hash === 'hashedPassword'))
}));


jest.mock('../utils/jwtHelper', () => {
  let userId: number | null = null;
  return {
    setUserId: (id: number) => { userId = id; },
    generateAccessToken: jest.fn().mockImplementation((payload) => `access-${payload.id}`),
    generateRefreshToken: jest.fn().mockImplementation((payload) => `refresh-${payload.id}`),
    verifyRefreshToken: jest.fn().mockImplementation((token) => {
      if (userId && token === `refresh-${userId}`) {
        return { id: userId, name: 'testUser' };
      }
      throw new Error('Invalid token');
    })
  };
});

describe('AuthService', () => {
  const getRegisterUserDto = (): RegisterUserDto => ({
    username: 'testUser',
    email: 'test.user@example.com',
    password: 'testPassword',
    confirmPassword: 'testPassword'
  });

  const getLoginRequestDto = (): LoginRequestDto => ({
    email: 'test.user@example.com',
    password: 'testPassword'
  });

  const getJwtPayload = (refreshToken: string): JwtPayload => ({
    refreshToken
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: 'test.user@example.com' } });
    const jwtHelper = require('../utils/jwtHelper');
    jwtHelper.setUserId(null);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'test.user@example.com' } });
    await prisma.$disconnect();
  });

  test('should register a user successfully', async () => {
    const userDto = getRegisterUserDto();
    const result = await AuthService.registerUser(userDto);
    expect(result.email).toBe(userDto.email);
    expect(result.name).toBe(userDto.username);
    expect(result).toHaveProperty('id');
  });

  test('should login a user successfully', async () => {
    const userDto = getRegisterUserDto();
    const user = await AuthService.registerUser(userDto);
    const jwtHelper = require('../utils/jwtHelper');
    jwtHelper.setUserId(user.id);
    const loginDto = getLoginRequestDto();
    const result = await AuthService.LoginUser(loginDto);
    expect(result).toHaveProperty('accessToken', `access-${user.id}`);
    expect(result).toHaveProperty('refreshToken', `refresh-${user.id}`);
    expect(result.id).toBe(user.id);
    expect(result.name).toBe(userDto.username);
  });

  test('should refresh token pair successfully', async () => {
    const userDto = getRegisterUserDto();
    const user = await AuthService.registerUser(userDto);
    const jwtHelper = require('../utils/jwtHelper');
    jwtHelper.setUserId(user.id);
    const loginDto = getLoginRequestDto();
    const loginResult = await AuthService.LoginUser(loginDto);
    const result = await AuthService.refreshTokenPair(loginResult.refreshToken);
    expect(result).toHaveProperty('accessToken', `access-${user.id}`);
    expect(result).toHaveProperty('refreshToken', `refresh-${user.id}`);
    const updatedUser = await prisma.user.findFirst({ where: { email: userDto.email } });
    expect(updatedUser?.refresh_token).toBe(result.refreshToken);
  });

  test('should fail to refresh token with invalid token', async () => {
    await expect(AuthService.refreshTokenPair('invalid-token')).rejects.toThrow('Invalid token');
  });

  
});