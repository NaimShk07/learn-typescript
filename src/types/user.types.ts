export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  refreshToken?: string;
  refresh_token?: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  refreshToken?: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export type SafeUser = Omit<User, "password">;
