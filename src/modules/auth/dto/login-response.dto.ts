export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  id: number;
  name: string | null;
  email: string | null;
}
