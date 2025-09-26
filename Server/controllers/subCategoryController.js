const SubCategory = require("../models/subCategory");

// Add sub category
const addSubCategory = async (req, res) => {
  const { category, subCategory } = req.body;

  if (!category || !subCategory) {
    return res.status(400).json({ message: "Both category and subCategory are required" });
  }

  const existing = await SubCategory.findOne({ subCategory });
  if (existing) {
    return res.status(400).json({ message: "Sub category already exists" });
  }

  const newSubCategory = await SubCategory.create({ category, subCategory });
  res.status(201).json(newSubCategory);
};

// Get all sub categories
const getAllSubCategories = async (req, res) => {
  const subCategories = await SubCategory.find().sort({ createdAt: -1 });
  res.json(subCategories);
};

// Update sub category
const updateSubCategory = async (req, res) => {
  const { id } = req.params;
  const { category, subCategory } = req.body;

  const existing = await SubCategory.findOne({ subCategory });
  if (existing && existing._id.toString() !== id) {
    return res.status(400).json({ message: "Sub category already exists" });
  }

  const updated = await SubCategory.findByIdAndUpdate(id, { category, subCategory }, { new: true });

  if (!updated) {
    return res.status(404).json({ message: "Sub category not found" });
  }

  res.json(updated);
};

// Delete sub category
const deleteSubCategory = async (req, res) => {
  const { id } = req.params;

  const deleted = await SubCategory.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "Sub category not found" });
  }

  res.json({ message: "Sub category deleted successfully" });
};

module.exports = {
  addSubCategory,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
};
