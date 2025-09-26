const { Schema, model } = require("mongoose");

const supplierRequestSchema = new Schema({
  // Company Details
  companyName: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  telephone: { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyTradeLicense: { type: String, required: true }, // File path
  vatRegistrationCertificate: { type: String, required: true }, // File path
  // Contact Person Details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  designation: { type: String, required: true },
  contactEmailAddress: { type: String, required: true },
  mobile: { type: String, required: true },
  // Product Service Details
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  // Status for active/inactive routes
  status: { type: String, default: "Pending", enum: ["Active", "Inactive", "Pending"] },
  inactiveReason: { type: String },
  inactivatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  inactivatedAt: { type: Date },
}, {
  timestamps: true,
});

const SupplierRequest= model("SupplierRequest", supplierRequestSchema);
module.exports = SupplierRequest
