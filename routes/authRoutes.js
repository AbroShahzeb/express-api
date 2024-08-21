import express from 'express';
const router = express.Router();

import {
    login,
    googleAuth,
    register,
    resetPassword,
    forgotPassword,
} from '../controllers/authController.js';

router.post('/login', login);
router.post('/register', register);
router.post('/google', googleAuth);
router.post('/reset-password/:token', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;
