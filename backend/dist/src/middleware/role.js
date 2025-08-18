"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(403).json({ message: "Authentication required" });
        }
        if (req.user.role !== role) {
            return res.status(403).json({ message: "Forbidden: insufficient privileges" });
        }
        next();
    };
};
exports.requireRole = requireRole;
