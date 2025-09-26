const express = require("express");
const {
  addSubCategory,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add",addSubCategory);
router.get("/view", getAllSubCategories);
router.put("/update/:id",  updateSubCategory);
router.delete("/delete/:id", deleteSubCategory);

module.exports = router;
