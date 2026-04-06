const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const {
  getWishlist,
  toggleWishlistItem,
  clearWishlist,
} = require("../controllers/wishlistController");

const toggleSchema = {
  productId: { required: true, isMongoId: true },
};

router.get("/", protect, getWishlist);
router.post("/toggle", protect, validate(toggleSchema), toggleWishlistItem);
router.delete("/", protect, clearWishlist);

module.exports = router;
