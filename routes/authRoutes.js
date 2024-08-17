import express from 'express';
const router = express.Router();

import { login, googleAuth, register } from '../controllers/authController.js';

router.post('/login', login);
router.post('/register', register);
router.post('/google', googleAuth);

export default router;
