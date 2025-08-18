import { Router } from "express";
import {
  createContent,
  getContent,
  approveContent,
  rejectContent,
  getContentStats,
  searchContent,
  getRecentActivity,
} from "../controllers/content.controller";
import { authenticateJWT } from "../middleware/auth";
import { requireRole } from "../middleware/role";

const router = Router();

router.use(authenticateJWT);

router.post("/", createContent);
router.get("/", getContent);
router.get("/stats", requireRole("admin"), getContentStats);
router.get("/search", authenticateJWT, searchContent);
router.get("/recent", requireRole("admin"), getRecentActivity);
router.put("/:id/approve", requireRole("admin"), approveContent);
router.put("/:id/reject", requireRole("admin"), rejectContent);

export default router;
