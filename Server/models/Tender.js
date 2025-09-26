const { Schema, model } = require("mongoose");

const tenderSchema = new Schema(
  {
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
    items: [
      {
        itemCode: { type: String, required: true },
        itemName: { type: String, required: true },
        partNo: { type: String, required: true },
        manufacturer: { type: String, required: true },
        uom: { type: String, required: true },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: false }, // added for supplier quotation
        total: { type: Number, required: false },
        // Set marginType to null by default
        marginType: {
          type: String,
          enum: ["Percentage", "Fixed Amount"],
          default: null,
        },
        marginValue: { type: Number, default: 0 }, // % or fixed amount
        marginTotal: { type: Number, default: 0 }, // calculated
      },
    ],
    interestedSuppliers: [
      {
        supplierId: { type: Schema.Types.ObjectId, ref: "SupplierRequest" },
        supplierName: { type: String },
        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },
        quotation: { type: String },
        selected: { type: Boolean, default: false },
        interestedDate: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const TenderCollection = model("Tender", tenderSchema);
module.exports = TenderCollection;
