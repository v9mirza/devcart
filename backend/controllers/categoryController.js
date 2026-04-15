const Category = require("../models/Category");
const mongoose = require("mongoose");

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category id" });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/categories (admin)
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name: name.trim(),
      description: description?.trim() || "",
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/categories/:id (admin)
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category id" });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      const existingCategory = await Category.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${name}$`, "i") },
      });
      if (existingCategory) {
        return res.status(400).json({ message: "Category name already exists" });
      }
      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description?.trim() || "";
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/categories/:id (admin)
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid category id" });
  }

  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted", category });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
