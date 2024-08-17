import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import cookieParser from 'cookie-parser';

import User from './models/userModel.js';
import globalErrorHandler from './controllers/errorController.js';
import catchAsync from './utils/catchAsync.js';

import express from 'express';
const app = express();

import { connectDB } from './utils/db.js';

import authRoutes from './routes/authRoutes.js';

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res, next) => {
    res.json({ message: 'Hello from the app' });
});

app.use('/api/v1/auth/', authRoutes);

app.use(globalErrorHandler);

connectDB().then(() => {
    app.listen(3000, () => console.log('App is listening on port 3000'));
});

// })
