import httpStatus from "http-status";
import { UserModel } from "../models/user.model";
import { z } from "zod";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";

import { Request, Response } from "express";

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
    res.status(411).json({
      message: "Error in inputs",
      error: parsedData.error.errors,
    });
  }

  try {
    const existingUser = await UserModel.find({ username });

    if (existingUser) {
      return res
        .status(httpStatus.FOUND)
        .json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    await UserModel.create({
      name,
      username,
      password: hashedPassword,
    });

    res.status(httpStatus.CREATED).json({
      message: "Signed up",
    });
  } catch (err) {
    res.status(500).json({
      message: `Server error ${err}`,
    });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const response = await UserModel.find({ username });

    if (!response || response.length === 0) {
      res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
      return;
    }

    const user = response[0];
    const matchedPassword = await bcrypt.compare(password, user.password as string);

    if(!matchedPassword){
        res.status(404).json({ message: "Invalid Credentials"})
    }

    const token = jwt.sign({
       id: user._id 
      }, process.env.JWT_USER_SECRET as string);

    res.status(200).json({
       message: "Signed in successfully", 
       token
       });
  } catch (err) {
    console.error(err);
    res.status(500).json({
       message: "Server error"
       });
  }
};
