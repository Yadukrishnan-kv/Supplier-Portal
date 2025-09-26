const Category = require("../models/Category");

// Add category
const addCategory = async (req, res) => {
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category field is required" });
  }

  const existing = await Category.findOne({ category });
  if (existing) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const newCategory = await Category.create({ category });
  res.status(201).json(newCategory);
};

// Get all categories
const getAllCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};

// Update category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  if (!category) {
    return res.status(400).json({ message: "Category field is required" });
  }

  const existing = await Category.findOne({ category });
  if (existing) {
    return res.status(400).json({ message: "Category already exists" });
  }

  const updated = await Category.findByIdAndUpdate(id, { category }, { new: true });

  if (!updated) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(updated);
};

// Delete category
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json({ message: "Category deleted successfully" });
};

module.exports = {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
