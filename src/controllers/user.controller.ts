import { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import { ApiResponse } from "../types/api-response.js";
import { SafeUser, User } from "../types/user.types.js";
import { HttpStatus } from "../types/http-status.js";
import { getRequestUser } from "../utils/request-user.js";

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getUsers();

  const response: ApiResponse<User[]> = {
    success: true,
    data: users as User[],
  };

  res.status(HttpStatus.OK).json(response);
};

export const getUsersById = async (req: Request, res: Response) => {
  const user = await userService.getUsersById(Number(req.params.id));

  const response: ApiResponse<User> = {
    success: true,
    data: user as User,
  };

  res.status(HttpStatus.OK).json(response);
};

export const create = async (req: Request, res: Response) => {
  const id = await userService.createUser(req.body);
  res.status(HttpStatus.CREATED).json({ id });
};

export const updateUser = async (req: Request, res: Response) => {
  await userService.updateUser(Number(req.params.id), req.body);

  res.status(HttpStatus.OK).json({
    success: true,
    message: "Updated",
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  await userService.deleteUser(Number(req.params.id));

  res.status(HttpStatus.OK).json({
    success: true,
    message: "Deleted",
  });
};

export const signUser = async (req: Request, res: Response) => {
  const id = await userService.signUser(req.body);

  const response: ApiResponse<{ id: number }> = {
    success: true,
    message: "User signed up successfully",
    data: { id },
  };

  res.status(HttpStatus.CREATED).json(response);
};

export const loginUser = async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await userService.loginUser(
    req.body
  );

  const response: ApiResponse<{
    user: SafeUser;
    accessToken: string;
  }> = {
    success: true,
    message: "User logged in successfully",
    data: { user, accessToken },
  };

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .status(HttpStatus.OK)
    .json(response);
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: refreshTokenFromCookie } = req.cookies;
  
  const { accessToken, refreshToken } = await userService.refreshToken({
    refreshToken: refreshTokenFromCookie,
  });

  const response: ApiResponse<{ accessToken: string }> = {
    success: true,
    message: "Token refreshed successfully",
    data: { accessToken },
  };

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })
    .status(HttpStatus.OK)
    .json(response);
};

export const logout = async (req: Request, res: Response) => {
  const user = getRequestUser(req);

  await userService.logout(user.id);

  res.clearCookie("refreshToken");
  res.status(HttpStatus.OK).json({
    success: true,
    message: "User logged out successfully",
  });
};
