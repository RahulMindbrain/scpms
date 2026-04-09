import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {
  generateAccessService,
  loginService,
  logoutService,
} from "./auth.service";
import { parseTTLToMs } from "../utils/parseTTL";
import { sendError, sendSuccess } from "../utils/response";

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 400, "Email and Password are required");
      return;
    }

    const { accessToken, refreshToken, user } = await loginService(
      email,
      password,
    );

    const accessMaxAge = parseTTLToMs(process.env.JWT_ACCESS_TTL!);
    const refreshMaxAge = parseTTLToMs(process.env.JWT_REFRESH_TTL!);

    res.cookie("userAccessToken", accessToken, {
      htAdminnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessMaxAge,
      path: "/",
    });

    res.cookie("userRefreshToken", refreshToken, {
      htAdminnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshMaxAge,
      path: "/",
    });

    sendSuccess(res, 200, "Login successful", user);
  } catch (error: any) {
    sendError(res, 401, error.message || "Login failed");
  }
};

export const regenAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.userRefreshToken;

    if (!refreshToken) {
      sendError(res, 401, "Refresh token missing");
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessService(refreshToken);

    const accessMaxAge = parseTTLToMs(process.env.jwtAccessExpires!);
    const refreshMaxAge = parseTTLToMs(process.env.jwtRefreshExpires!);

    res.cookie("userAccessToken", accessToken, {
      htAdminnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: accessMaxAge,
      path: "/",
    });

    res.cookie("userRefreshToken", newRefreshToken, {
      htAdminnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshMaxAge,
      path: "/",
    });

    sendSuccess(res, 200, "Token refreshed successfully");
  } catch (error: any) {
    sendError(res, 403, error.message);
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.userAccessToken;

    if (!token) {
      sendError(res, 401, "Access token missing");
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.jwtAccessSecret as string,
    ) as { id: number };

    await logoutService(decoded.id);

    const cookieOptions = {
      htAdminnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    res.clearCookie("userAccessToken", cookieOptions);
    res.clearCookie("userRefreshToken", cookieOptions);

    sendSuccess(res, 200, "Logout successful");
  } catch {
    sendError(res, 401, "Invalid token");
  }
};
