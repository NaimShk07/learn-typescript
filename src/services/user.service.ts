import { HttpStatus } from "../types/http-status.js";
import * as userRepository from "../repositories/user.repository.js";
import {
  CreateUserDto,
  LoginUserDto,
  SafeUser,
  UpdateUserDto,
  User,
} from "../types/user.types.js";
import { AppError } from "../utils/AppError.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { JwtPayload } from "../types/jwt.js";

export const getUsers = async () => {
  return userRepository.findAll();
};

export const getUsersById = async (id: number): Promise<SafeUser> => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "User not found");
  }

  const {
    password: _,
    refresh_token: __,
    refreshToken: ___,
    ...safeUser
  } = user;
  return safeUser;
};

export const createUser = async (data: CreateUserDto) => {
  const hashedPassword = await hashPassword(data.password);
  return await userRepository.create({
    ...data,
    password: hashedPassword,
  });
};

export const updateUser = async (id: number, data: UpdateUserDto) => {
  const updateData = { ...data };
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }
  const result = await userRepository.update(id, updateData);

  if (result.affectedRows === 0) {
    throw new AppError(HttpStatus.NOT_FOUND, "User not found");
  }
  return;
};

export const deleteUser = async (id: number) => {
  const result = await userRepository.remove(id);

  if (result.affectedRows === 0) {
    throw new AppError(HttpStatus.NOT_FOUND, "User not found");
  }

  return result;
};

export const signUser = async (data: CreateUserDto) => {
  const isExist = await userRepository.isEmailExist(data.email);
  if (isExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, "This email already exist");
  }

  const hashedPassword = await hashPassword(data.password);

  return await userRepository.create({
    ...data,
    password: hashedPassword,
  });
};

export const loginUser = async (data: LoginUserDto) => {
  const user: User | undefined = await userRepository.findByEmail(data.email);

  if (!user) {
    throw new AppError(HttpStatus.BAD_REQUEST, "This email is not registered.");
  }

  const isPasswordSame = await comparePassword(data.password, user.password);

  if (!isPasswordSame) {
    throw new AppError(HttpStatus.BAD_REQUEST, "Password is incorrect");
  }

  const payload: JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken: string = generateAccessToken(payload);
  const refreshToken: string = generateRefreshToken(payload);

  await userRepository.update(user.id, {
    name: user.name,
    email: user.email,
    refreshToken: refreshToken,
  });

  // const safeUser: SafeUser = { ...user };
  const { password: _, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

export const refreshToken = async (data: { refreshToken: string }) => {
  const verifiedToken = verifyRefreshToken(data.refreshToken);

  const user = await userRepository.findById(verifiedToken.id);
  if (!user) {
    throw new AppError(HttpStatus.NOT_FOUND, "User not found");
  }

  if (user.refresh_token !== data.refreshToken) {
    throw new AppError(HttpStatus.UNAUTHORIZED, "Refresh token mismatch");
  }

  const payload: JwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  await userRepository.update(user.id, {
    refreshToken: newRefreshToken,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logout = async (id: number) => {
  return await userRepository.update(id, {
    refreshToken: "",
  });
};
