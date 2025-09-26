const { Schema, model } = require("mongoose");

const subCategorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

const SubCategory = model("SubCategory", subCategorySchema);
module.exports = SubCategory;
