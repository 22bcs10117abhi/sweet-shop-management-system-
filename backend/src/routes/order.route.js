import { Router } from "express";
import { createOrder, createCustomerOrder, getAllOrders, getOrderById, getCustomerOrders, updateOrder, approveOrder, rejectOrder, cancelOrder, getOrderStats } from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Customer endpoints (no auth required)
router.post("/customer", createCustomerOrder);
router.get("/customer", getCustomerOrders);
// Admin order endpoints (requires auth)
router.post("/", verifyToken, createOrder);
router.get("/", verifyToken, getAllOrders);
router.get("/stats", verifyToken, getOrderStats);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id", verifyToken, updateOrder);
router.post("/:id/approve", verifyToken, approveOrder);
router.post("/:id/reject", verifyToken, rejectOrder);
router.post("/:id/cancel", verifyToken, cancelOrder);

export default router;

