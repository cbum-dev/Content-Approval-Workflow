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
app.use(cors({
    origin: allowedOrigins,
  }));

app.get('/', (req, res) => {
    res.send('Hello World');
})

prisma.$connect().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});



app.use('/auth', authRoutes);
app.use('/content', contentRoutes);

export default app;
