const { Schema,model} = require("mongoose");
const adminSchema = new Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
 role: { type: String, enum: ["admin", "subadmin", "supplier"], default: "admin" }
},{timestamps: true});


const adminCollection = model("Admin", adminSchema);
module.exports = adminCollection;