import httpStatus from "http-status";
import { UserModel } from "../models/user.model";
import { z } from "zod";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { Request, Response, NextFunction, RequestHandler } from "express";

export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

const register = async (req: Request, res: Response) => {
  const { name, username, password } = req.body;

  const requiredObj = z.object({
    name: z.string().min(3).max(10),
    username: z
      .string()
      .min(3)
      .max(100)
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .regex(/^[a-zA-Z]/, "Username must start with a letter"),
    password: z
      .string()
      .min(8)
      .max(20)
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  });

  const parsedData = requiredObj.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(411).json({
      message: "Error in inputs",
      error: parsedData.error.errors,
    });
  }

  try {
    const existingUser = await UserModel.find({ username });

    if (existingUser.length > 0) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "User already exists" });
    }

    // Generate salt and hash password using crypto
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(password, salt);
    const saltedHash = `${salt}:${hash}`;

    await UserModel.create({
      name,
      username,
      password: saltedHash,
    });

    return res.status(httpStatus.CREATED).json({
      message: "Signed up successfully"
    });
  } catch (err) {
    return res.status(500).json({
      message: `Server error ${err}`,
    });
  }
};

const hashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Invalid credentials"
      });
    }

    // Assume user.password is stored as "salt:hash"
    const [salt, storedHash] = (user.password as string).split(":");
    const hash = hashPassword(password, salt);
    if (hash !== storedHash) {
      // Invalid credentials
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_USER_SECRET as string,
      { expiresIn: "1h" }
    );

    return res.status(httpStatus.OK).json({
      message: "Signed in successfully",
      token
    });
  } catch (err) {
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Server error"
    });
  }
};

export { register, login }