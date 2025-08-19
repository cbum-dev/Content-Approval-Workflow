import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma/client';
import "./types/express"

import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://content-approval-workflow-tf9g.vercel.app',
  credentials: true
}));
app.use(express.json());

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