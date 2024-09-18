import express from 'express';
const router = express.Router();

import multer from 'multer';

import {
    login,
    googleAuth,
    register,
    resetPassword,
    forgotPassword,
    uploadImage,
} from '../controllers/authController.js';
import AppError from '../utils/appError.js';

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/events');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `event-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not a image, only images are allowed', 400), false);
    }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

router.post('/login', login);
router.post('/register', register);
router.post('/google', googleAuth);
router.post('/reset-password/:token', resetPassword);
router.post('/forgot-password', forgotPassword);

router.post('/upload', upload.single('photo'), uploadImage);

export default router;
