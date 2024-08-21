import express from 'express';
const router = express.Router();

import { login, googleAuth, register } from '../controllers/authController.js';
import Email from '../utils/email.js';
import catchAsync from '../utils/catchAsync.js';

const email = new Email(
    { name: 'Shahzeb', email: 'shahzebaliabro12345@gmail.com' },
    'https://event-hub-fast.vercel.app/login'
);

// heeeehuwhfiuw

router.post('/login', login);
router.post('/register', register);
router.post('/google', googleAuth);
router.post(
    '/mail',
    catchAsync(async (req, res, next) => {
        await email.sendPasswordReset();
        res.json({ message: 'Email sent successfully' });
    })
);

export default router;
