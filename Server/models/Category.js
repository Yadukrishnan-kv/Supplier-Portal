const { Schema,model} = require("mongoose");

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });


adminCollection = model("Category", categorySchema);
module.exports = adminCollection;