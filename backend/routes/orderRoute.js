import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  allOrders,
  placeOrder,
  updateOrderStatus,
  userOrders,
  placeOrderPaymentSuccess, // Adjusted to use the new payment method
} from "../controllers/orderController.js";
import { isAuthorized } from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateOrderStatus);

// Payment feature (Now simplified to only mimic payment)
orderRouter.post("/place", isAuthorized, placeOrder); // Place order without actual payment
orderRouter.post("/payment-success", isAuthorized, placeOrderPaymentSuccess); // Mimic payment success

// User orders
orderRouter.post("/user-orders", isAuthorized, userOrders);


orderRouter.post("/verify-payment", isAuthorized, placeOrderPaymentSuccess); // Simulated verification

export default orderRouter;
