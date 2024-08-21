import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';

import cors from 'cors';
import cookieParser from 'cookie-parser';

import globalErrorHandler from './controllers/errorController.js';

import express from 'express';
const app = express();

import { connectDB } from './utils/db.js';

import authRoutes from './routes/authRoutes.js';

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine to Pug
app.set('view engine', 'pug');

// Set the directory where Pug templates are located
app.set('views', path.join(__dirname, 'views'));

// console.log('Public path', path.join(import.meta.url, '../public'));

app.get('/', async (req, res, next) => {
    res.json({ message: 'Hello from the app' });
});

app.use('/api/v1/auth/', authRoutes);

app.use(globalErrorHandler);

connectDB().then(() => {
    app.listen(3000, () => console.log('App is listening on port 3000'));
});

// })
