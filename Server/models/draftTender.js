// models/DraftTender.js
const { Schema, model } = require("mongoose");

const draftTenderSchema = new Schema({
  projectCode: { type: String, required: true, unique: true },
  projectName: { type: String, required: true },
  organisation: { type: String, required: true },
  projectTitle: { type: String, required: true },
  supplyCategory: { type: String, required: true },
  projectScope: { type: String, required: true },
  publishingDate: { type: Date, required: true },
  closingDate: { type: Date, required: true },
  scopeOfWork: [{ type: String, required: true }],
  rfq: [{ type: String, required: true }],
  items: [{
    itemCode: { type: String, required: true },
    itemName: { type: String, required: true },
    partNo: { type: String, required: true },
    manufacturer: { type: String, required: true },
    uom: { type: String, required: true },
    qty: { type: Number, required: true }
  }],
  readyToPublish: { type: Boolean, default: false },
}, {
  timestamps: true,
});

const DraftTender = model("DraftTender", draftTenderSchema);
module.exports = DraftTender;