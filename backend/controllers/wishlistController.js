const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      "products",
      "name image price countInStock"
    );

    if (!wishlist) {
      return res.json({ user: req.user._id, products: [] });
    }
    res.json(wishlist);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Toggle product in wishlist (Add/Remove)
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlistItem = async (req, res) => {
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.findIndex(
      (id) => id.toString() === productId
    );

    let message;
    if (index > -1) {
      // It exists, remove it
      wishlist.products.splice(index, 1);
      message = "Product removed from wishlist";
    } else {
      // Add it
      wishlist.products.push(productId);
      message = "Product added to wishlist";
    }

    await wishlist.save();
    
    // Repopulate for the response so frontend immediately has product data
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate(
      "products",
      "name image price countInStock"
    );

    res.status(200).json({ message, wishlist: populatedWishlist });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.json({ message: "Wishlist is already empty" });
    }

    wishlist.products = [];
    await wishlist.save();
    res.json({ message: "Wishlist cleared" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
