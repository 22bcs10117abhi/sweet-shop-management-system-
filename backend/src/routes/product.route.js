import { Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getLowStockProducts } from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyToken, createProduct);
router.get("/", getAllProducts);
router.get("/low-stock", verifyToken, getLowStockProducts);
router.get("/:id", getProductById);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;

