export type RegisterUserDto = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type LoginRequestDto = {
    email: string;
    password: string;
}

export type LoginResponseDto = {
    accessToken: string;
    refreshToken: string;
    userId: number;
    username: string | null;
    email: string | null;
}