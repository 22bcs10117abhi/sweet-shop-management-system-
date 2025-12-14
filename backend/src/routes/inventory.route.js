import { Router } from "express";
import { getAllInventory, getInventoryByProductId, updateInventory, restockInventory, getLowStockItems } from "../controllers/inventory.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, getAllInventory);
router.get("/low-stock", verifyToken, getLowStockItems);
router.get("/product/:productId", verifyToken, getInventoryByProductId);
router.put("/product/:productId", verifyToken, updateInventory);
router.post("/product/:productId/restock", verifyToken, restockInventory);

export default router;

