import express from 'express';
const router = express.Router();

import { login, googleAuth, register } from '../controllers/authController.js';
import { sendEmail } from '../utils/email.js';

router.post('/login', login);
router.post('/register', register);
router.post('/google', googleAuth);
router.post('/mail', sendEmail);

export default router;
