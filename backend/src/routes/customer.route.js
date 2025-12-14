import { Router } from "express";
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer, registerCustomer } from "../controllers/customer.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route for customer registration (no auth required)
router.post("/register", registerCustomer);

// Protected routes (require auth token)
router.post("/", verifyToken, createCustomer);
router.get("/", verifyToken, getAllCustomers);
router.get("/:id", verifyToken, getCustomerById);
router.put("/:id", verifyToken, updateCustomer);
router.delete("/:id", verifyToken, deleteCustomer);

export default router;

