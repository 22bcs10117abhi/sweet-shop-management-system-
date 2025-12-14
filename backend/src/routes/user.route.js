import { Router } from "express";
import { getNonce, verify, justGetToken, logout, adminLogin } from "../controllers/user.controller.js";
const router = Router();

router.get("/nonce", getNonce);
router.post("/verify", verify);
router.post("/token", justGetToken);
router.post("/admin/login", adminLogin);
router.post("/logout", logout);

export default router;