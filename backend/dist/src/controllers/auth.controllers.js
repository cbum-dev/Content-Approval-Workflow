"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const JWT_SECRET = process.env.JWT_SECRET;
const signup = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const existingUser = await client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await client_1.default.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                role: role || "user",
            },
        });
        res.status(201).json({ message: "User created", user: { id: user.id, email: user.email, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: "Signup failed" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', { email, password });
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            console.log('No user found for email:', email);
            return res.status(401).json({ message: "Invalid credentials: user not found" });
        }
        const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!valid) {
            console.log('Password mismatch for user:', email);
            return res.status(401).json({ message: "Invalid credentials: password incorrect" });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "12h" });
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    }
    catch (error) {
        console.error('Login error:', error);
        if (error instanceof Error) {
            res.status(500).json({ error: `Login failed!!!: ${error.message}` });
        }
        else {
            res.status(500).json({ error: "Login failed!!!: Unknown error" });
        }
    }
};
exports.login = login;
