"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = __importDefault(require("./prisma/client"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const content_routes_1 = __importDefault(require("./routes/content.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:5173",
    "https://content-approval-workflow-ujd7.vercel.app"
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
}));
app.get('/', (req, res) => {
    res.send('Hello World');
});
client_1.default.$connect().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});
app.use('/auth', auth_routes_1.default);
app.use('/content', content_routes_1.default);
exports.default = app;
