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
    id: number;
    name: string | null;
    email: string | null;
}