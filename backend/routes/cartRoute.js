import express from "express";
import {
  addToCart,
  getUserCarts,
  updateCart,
} from "../controllers/cartController.js";
import { isAuthorized } from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/add", isAuthorized, addToCart);
cartRouter.post("/update", isAuthorized, updateCart);
cartRouter.get("/get", isAuthorized, getUserCarts);

export default cartRouter;