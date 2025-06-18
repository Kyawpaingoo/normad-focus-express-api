import { LoginResponseDto, RegisterUserDto, LoginRequestDto } from '../dtos/userDtos';
import prisma from '../prisma'
import * as AuthService from '../service/authService';
import { User } from '@prisma/client';

describe('AuthService', ()=> {
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

     beforeEach(async () => {
        await prisma.user.deleteMany({ where: { email: 'test.user@example.com' } });
    });

    afterAll(async () => {
        await prisma.user.deleteMany({ where: { email: 'test.user@example.com' } });
        await prisma.$disconnect();
    });

    test('should throw error if passwords do not match', async () => {
        const userDto = getRegisterUserDto();
        userDto.confirmPassword = 'wrongPassword';

        await expect(AuthService.registerUser(userDto)).rejects.toThrow('Passwords do not match');
    });
   
    test('should throw error if password is less than 6 characters', async () => {
        const userDto = getRegisterUserDto();
        userDto.password = 'pass';
        userDto.confirmPassword = 'pass';

        await expect(AuthService.registerUser(userDto)).rejects.toThrow('Password must be at least 6 characters long');
    });

    test('should register a new user', async () => {
        const userDto = getRegisterUserDto();
        const result = await AuthService.registerUser(userDto);

        expect(result.email).toBe(userDto.email);
        expect(result.name).toBe(userDto.username);
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('created_at');
    });

    test('should throw error if user already exists', async () => {
        const userDto = getRegisterUserDto();
        await AuthService.registerUser(userDto);

        await expect(AuthService.registerUser(userDto)).rejects.toThrow('User already exists with this email');
    });

    test('should login a user', async () => {
        const userDto = getRegisterUserDto();
        await AuthService.registerUser(userDto);

        const loginDto = getLoginRequestDto();
        const result = await AuthService.LoginUser(loginDto);

        expect(result).toHaveProperty('accessToken');
        expect(result).toHaveProperty('refreshToken');
        expect(result).toHaveProperty('userId');
        expect(result).toHaveProperty('username');
        expect(result.userId).toBeDefined();
        expect(result.username).toBe(userDto.username);
    });

    test('should throw error if user is not found', async () => {
        const loginDto = getLoginRequestDto();
        loginDto.email = 'wrong@example.com';

        await expect(AuthService.LoginUser(loginDto)).rejects.toThrow('User not found');
    });

    test('should throw error if password is invalid', async () => {
        const userDto = getRegisterUserDto();
        await AuthService.registerUser(userDto);
        
        const loginDto = getLoginRequestDto();
        loginDto.password = 'wrongPassword';
        await expect(AuthService.LoginUser(loginDto)).rejects.toThrow('Invalid password');
    });
});