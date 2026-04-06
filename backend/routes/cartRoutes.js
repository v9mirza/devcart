const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

// Validation schemas
const addToCartSchema = {
  productId: { required: true, isMongoId: true },
  qty: { isNumber: true, isPositive: true },
};

const updateCartSchema = {
  qty: { required: true, isNumber: true, isPositive: true },
};

router.get("/", protect, getCart);
router.post("/", protect, validate(addToCartSchema), addToCart);
router.put("/:productId", protect, validate(updateCartSchema), updateCartItem);
router.delete("/", protect, clearCart);
router.delete("/:productId", protect, removeCartItem);

module.exports = router;
