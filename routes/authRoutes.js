import express from "express";
const router = express.Router();

import { login, googleAuth } from "../controllers/authController.js";

router.post("/login", login);
router.post("/google", googleAuth);

export default router;
