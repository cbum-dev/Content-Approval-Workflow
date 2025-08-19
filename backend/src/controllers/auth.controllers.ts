import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: role || "user",
      },
    });
    res.status(201).json({ message: "User created", user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password });
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('No user found for email:', email);
      return res.status(401).json({ message: "Invalid credentials: user not found" });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: "Invalid credentials: password incorrect" });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "12h" }
    );
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "Login failed", details: error instanceof Error ? error.message : error });
  }
};

