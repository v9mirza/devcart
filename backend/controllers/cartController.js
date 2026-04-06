const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add item to cart (or increment qty if already exists)
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const { productId, qty = 1 } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.countInStock < qty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty,
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update qty for a specific cart item
// @route   PUT /api/cart/:productId
// @access  Private
exports.updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { qty } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    const product = await Product.findById(productId);
    if (product && product.countInStock < qty) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    item.qty = qty;
    await cart.save();
    res.json(cart);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Remove one item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeCartItem = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter(
      (i) => i.product.toString() !== productId
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    await cart.save();
    res.json(cart);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ message: "Cart is already empty" });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
