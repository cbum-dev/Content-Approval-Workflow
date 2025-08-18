import type { Request, Response, NextFunction } from "express";

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: "Authentication required" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: insufficient privileges" });
    }
    next();
  };
};
