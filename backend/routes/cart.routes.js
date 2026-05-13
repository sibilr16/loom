import express from "express";
import { protect } from "../middleware/protect.js";
import addToCartHandler from "../controllers/addToCartHandler.js";
import getCartHandler from "../controllers/getCartHandler.js";
import deleteCartItemHandler from "../controllers/deleteCartItemHandler.js";
import updateCartItemHandler from "../controllers/updateCartItemHandler.js";
const router = express.Router();

router.post("/add-to-cart", protect, addToCartHandler);
router.get("/get-cart", protect, getCartHandler);
router.post("/delete-cart-item", protect, deleteCartItemHandler);
router.post("/update-cart-item", protect, updateCartItemHandler);
// router.get("/get-products", getProductsHAndler);
// router.get("/get-product/:id", getProductById);

export default router;
