import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma/client';

import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';

dotenv.config();
const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://content-approval-workflow-tf9g.vercel.app"
];

// Enhanced CORS configuration
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
    optionsSuccessStatus: 200
}));

// Add middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

prisma.$connect().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

app.use('/auth', authRoutes);
app.use('/content', contentRoutes);

export default app;