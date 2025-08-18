import type { Request, Response } from "express";
import prisma from "../prisma/client";

export const createContent = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const content = await prisma.content.create({
      data: {
        title,
        description,
        createdById: req.user.userId,
        status: "pending",
      },
    });

    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: "Failed to create content" });
  }
};

export const getContent = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    if (req.user.role === "admin") {
      const contents = await prisma.content.findMany({
        // Admin: Return all content
        include: { createdBy: { select: { email: true } } },
        orderBy: { createdAt: "desc" },
      });
      return res.json(contents);
    }

    const contents = await prisma.content.findMany({
      where: { createdById: req.user.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve content" });
  }
};

// Approve(Admin Only)
export const approveContent = async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;

    if (!contentId) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const updated = await prisma.content.update({
      where: { id: contentId },
      data: { status: "approved" },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to approve content" });
  }
};

//Reject(Admin Only)
export const rejectContent = async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;


    if (!contentId) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const updated = await prisma.content.update({
      where: { id: contentId },
      data: { status: "rejected" },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to reject content" });
  }
};

export const getContentStats = async (req: Request, res: Response) => {
  try {
    const approved = await prisma.content.count({ where: { status: "approved" } });
    const pending = await prisma.content.count({ where: { status: "pending" } });
    const rejected = await prisma.content.count({ where: { status: "rejected" } });
    const total = approved + pending + rejected;

    res.json({ total, approved, pending, rejected });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch content stats" });
  }
};

export const searchContent = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { status, keyword } = req.query;

    // Build filter object
    const filters: any = {};

    if (status && typeof status === "string") {
      filters.status = status;
    }

    if (keyword && typeof keyword === "string") {
      filters.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ];
    }

    // Role-based access limiting
    if (req.user.role !== "admin") {
      filters.createdById = req.user.userId;
    }

    const results = await prisma.content.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: req.user.role === "admin" ? { createdBy: { select: { email: true } } } : {},
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to search content" });
  }
};

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const recent = await prisma.content.findMany({
      where: { status: { in: ["approved", "rejected"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { createdBy: { select: { email: true } } },
    });

    res.json(recent);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recent activity" });
  }
};
