import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createNotice,
  getAllNotices,
  watermarkPdf,
} from "../controllers/notice.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.post("/", verifyToken, createNotice);
router.get("/", getAllNotices);
router.route("/add-pdf").post(verifyToken, upload.single("pdfFileBuffer"), watermarkPdf);

export default router;
