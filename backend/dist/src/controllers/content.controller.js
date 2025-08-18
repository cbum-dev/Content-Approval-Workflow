"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentActivity = exports.searchContent = exports.getContentStats = exports.rejectContent = exports.approveContent = exports.getContent = exports.createContent = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const createContent = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const content = await client_1.default.content.create({
            data: {
                title,
                description,
                createdById: req.user.userId,
                status: "pending",
            },
        });
        res.status(201).json(content);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create content" });
    }
};
exports.createContent = createContent;
const getContent = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        if (req.user.role === "admin") {
            const contents = await client_1.default.content.findMany({
                // Admin: Return all content
                include: { createdBy: { select: { email: true } } },
                orderBy: { createdAt: "desc" },
            });
            return res.json(contents);
        }
        const contents = await client_1.default.content.findMany({
            where: { createdById: req.user.userId },
            orderBy: { createdAt: "desc" },
        });
        res.json(contents);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve content" });
    }
};
exports.getContent = getContent;
// Approve(Admin Only)
const approveContent = async (req, res) => {
    try {
        const contentId = req.params.id;
        if (!contentId) {
            return res.status(400).json({ message: "Content ID is required" });
        }
        const updated = await client_1.default.content.update({
            where: { id: contentId },
            data: { status: "approved" },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to approve content" });
    }
};
exports.approveContent = approveContent;
//Reject(Admin Only)
const rejectContent = async (req, res) => {
    try {
        const contentId = req.params.id;
        if (!contentId) {
            return res.status(400).json({ message: "Content ID is required" });
        }
        const updated = await client_1.default.content.update({
            where: { id: contentId },
            data: { status: "rejected" },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to reject content" });
    }
};
exports.rejectContent = rejectContent;
const getContentStats = async (req, res) => {
    try {
        const approved = await client_1.default.content.count({ where: { status: "approved" } });
        const pending = await client_1.default.content.count({ where: { status: "pending" } });
        const rejected = await client_1.default.content.count({ where: { status: "rejected" } });
        const total = approved + pending + rejected;
        res.json({ total, approved, pending, rejected });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch content stats" });
    }
};
exports.getContentStats = getContentStats;
const searchContent = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ message: "Unauthorized" });
        const { status, keyword } = req.query;
        // Build filter object
        const filters = {};
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
        const results = await client_1.default.content.findMany({
            where: filters,
            orderBy: { createdAt: "desc" },
            include: req.user.role === "admin" ? { createdBy: { select: { email: true } } } : {},
        });
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to search content" });
    }
};
exports.searchContent = searchContent;
const getRecentActivity = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }
        const recent = await client_1.default.content.findMany({
            where: { status: { in: ["approved", "rejected"] } },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { createdBy: { select: { email: true } } },
        });
        res.json(recent);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch recent activity" });
    }
};
exports.getRecentActivity = getRecentActivity;
