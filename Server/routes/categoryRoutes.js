const express = require("express");
const {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add new category
router.post("/add",addCategory);

// Get all categories
router.get("/view", getAllCategories);

// Update category
router.put("/update/:id", updateCategory);

// Delete category
router.delete("/delete/:id",  deleteCategory);

module.exports = router;
