// controllers/TenderController.js
const DraftTender = require("../models/draftTender");

const Tender = require("../models/Tender");

const path = require("path");
const fs = require("fs");



const createTender = async (req, res) => {
  try {
    console.log("✅ Request body:", req.body);
    console.log("📁 Files received:", req.files);

    const {
      projectCode, projectName, organisation, projectTitle, supplyCategory,
      projectScope, publishingDate, closingDate,
    } = req.body;

    // Validation...
    const requiredFields = [
      "projectCode", "projectName", "organisation", "projectTitle",
      "supplyCategory", "projectScope", "publishingDate", "closingDate",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        console.log(`❌ Missing field: ${field}`);
        return res.status(400).json({ message: `${field} is required`, field });
      }
    }

    if (!req.files || !req.files.scopeOfWork || req.files.scopeOfWork.length === 0) {
      console.log("❌ No scopeOfWork files uploaded");
      return res.status(400).json({ message: "Scope of Work files are required" });
    }

    if (!req.files.rfq || req.files.rfq.length === 0) {
      console.log("❌ No RFQ files uploaded");
      return res.status(400).json({ message: "RFQ files are required" });
    }

    const existingDraft = await DraftTender.findOne({ projectCode });
    if (existingDraft) {
      return res.status(400).json({ message: "Draft with this Project Code already exists" });
    }

    const items = req.body.items ? JSON.parse(req.body.items) : [];
    console.log("📦 Items parsed:", items);

    const newDraft = new DraftTender({
      projectCode,
      projectName,
      organisation,
      projectTitle,
      supplyCategory,
      projectScope,
      publishingDate: new Date(publishingDate),
      closingDate: new Date(closingDate),
      scopeOfWork: req.files.scopeOfWork.map(file => file.path),
      rfq: req.files.rfq.map(file => file.path),
      items,
      readyToPublish: false,
    });

    console.log("💾 Draft to save:", newDraft);

    await newDraft.save(); // This must be awaited

    console.log("🎉 Draft saved successfully with ID:", newDraft._id);

    res.status(201).json({
      message: "Tender draft created successfully",
      data: newDraft,
    });
  } catch (error) {
    console.error("🚨 Draft creation error:", error.message);
    console.error("Full error:", error); // Log full error
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
// ✅ GET ALL DRAFTS
const getAllDrafts = async (req, res) => {
  try {
    const drafts = await DraftTender.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Drafts retrieved successfully",
      data: drafts,
    });
  } catch (error) {
    console.error("Error fetching drafts:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
// ✅ MARK DRAFT AS READY TO PUBLISH
const markDraftAsReady = async (req, res) => {
  try {
    const { id } = req.params;

    const draft = await DraftTender.findById(id);
    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    draft.readyToPublish = true;
    await draft.save();

    res.status(200).json({
      message: "Draft marked as ready to publish",
      data: draft,
    });
  } catch (error) {
    console.error("Error marking draft as ready:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ GET DRAFT BY ID
const getDraftById = async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await DraftTender.findById(id);
    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }
    res.status(200).json({
      message: "Draft retrieved successfully",
      data: draft,
    });
  } catch (error) {
    console.error("Error fetching draft by ID:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// ✅ PUBLISH DRAFT TO TENDER
const publishDraft = async (req, res) => {
  try {
    const { id } = req.params;

    const draft = await DraftTender.findById(id);
    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    if (!draft.readyToPublish) {
      return res.status(400).json({ message: "Draft is not marked as ready to publish" });
    }

    const newTender = new Tender({
      projectCode: draft.projectCode,
      projectName: draft.projectName,
      organisation: draft.organisation,
      projectTitle: draft.projectTitle,
      supplyCategory: draft.supplyCategory,
      projectScope: draft.projectScope,
      publishingDate: draft.publishingDate,
      closingDate: draft.closingDate,
      scopeOfWork: draft.scopeOfWork,
      rfq: draft.rfq,
      items: draft.items,
    });

    await newTender.save();
    await DraftTender.findByIdAndDelete(id);

    res.status(201).json({
      message: "Tender published successfully",
      data: newTender,
    });
  } catch (error) {
    console.error("Publish draft error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const updateDraft = async (req, res) => {
  try {
    const { id } = req.params;

    // Find draft
    const draft = await DraftTender.findById(id);
    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    // Extract form data
    const {
      projectCode, projectName, organisation, projectTitle,
      supplyCategory, projectScope, publishingDate, closingDate,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "projectCode", "projectName", "organisation", "projectTitle",
      "supplyCategory", "projectScope", "publishingDate", "closingDate",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Parse items
    const items = req.body.items ? JSON.parse(req.body.items) : [];

    // Handle file updates
    const updateFiles = (oldFiles, newFiles) => {
      if (newFiles && newFiles.length > 0) {
        // Delete old files
        oldFiles.forEach(filePath => {
          const fullPath = path.join(__dirname, '..', filePath);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });
        return newFiles.map(file => file.path);
      }
      return oldFiles;
    };

    // Update fields
    draft.projectCode = projectCode;
    draft.projectName = projectName;
    draft.organisation = organisation;
    draft.projectTitle = projectTitle;
    draft.supplyCategory = supplyCategory;
    draft.projectScope = projectScope;
    draft.publishingDate = new Date(publishingDate);
    draft.closingDate = new Date(closingDate);
    draft.items = items;

    // Update files if uploaded
    if (req.files) {
      if (req.files.scopeOfWork) {
        draft.scopeOfWork = updateFiles(draft.scopeOfWork, req.files.scopeOfWork);
      }
      if (req.files.rfq) {
        draft.rfq = updateFiles(draft.rfq, req.files.rfq);
      }
    }

    // Save updated draft
    await draft.save();

    res.status(200).json({
      message: "Draft updated successfully",
       draft,
    });
  } catch (error) {
    console.error("Error updating draft:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const deleteDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const draft = await DraftTender.findByIdAndDelete(id);
    if (!draft) return res.status(404).json({ message: "Draft not found" });
    res.status(200).json({ message: "Draft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting draft", error: error.message });
  }
};

// ✅ GET ALL TENDERS
const getAllTenders = async (req, res) => {
  try {
    const tenders = await Tender.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Tenders retrieved successfully",
      data: tenders,
    });
  } catch (error) {
    console.error("Error fetching tenders:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ GET TENDER BY ID
const getTenderById = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);
    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }
    res.status(200).json({ message: "Tender retrieved successfully", data: tender });
  } catch (error) {
    console.error("Error fetching tender by ID:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ GET TENDER BY CATEGORY
const getTenderByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }
    const tenders = await Tender.find({ supplyCategory: category });
    res.status(200).json({
      message: "Tenders fetched successfully",
      data: tenders,
    });
  } catch (error) {
    console.error("Error fetching tenders by category:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ DELETE TENDER
const deleteTender = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTender = await Tender.findByIdAndDelete(id);
    if (!deletedTender) {
      return res.status(404).json({ message: "Tender not found" });
    }
    res.status(200).json({ message: "Tender deleted successfully", data: deletedTender });
  } catch (error) {
    console.error("Error deleting tender:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ DOWNLOAD FILE
const downloadTenderFile = async (req, res) => {
  try {
    const { tenderId, fileType, fileIndex } = req.params;
    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }

    let filePath;
    if (fileType === 'scopeOfWork' && tender.scopeOfWork[fileIndex]) {
      filePath = tender.scopeOfWork[fileIndex];
    } else if (fileType === 'rfq' && tender.rfq[fileIndex]) {
      filePath = tender.rfq[fileIndex];
    } else {
      return res.status(404).json({ message: "File not found" });
    }

    const absolutePath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(absolutePath)) {
      res.download(absolutePath, (err) => {
        if (err) {
          res.status(500).json({ message: "Error downloading file" });
        }
      });
    } else {
      res.status(404).json({ message: "File not found on server" });
    }
  } catch (error) {
    console.error("Error in downloadTenderFile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ UPDATE TENDER
const updateTender = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectCode, projectName, organisation, projectTitle, supplyCategory,
      projectScope, publishingDate, closingDate,
    } = req.body;

    const tender = await Tender.findById(id);
    if (!tender) return res.status(404).json({ message: "Tender not found" });

    const updatedFields = {
      projectCode,
      projectName,
      organisation,
      projectTitle,
      supplyCategory,
      projectScope,
      publishingDate: new Date(publishingDate),
      closingDate: new Date(closingDate),
    };

    if (req.files) {
      if (req.files.scopeOfWork?.length > 0) {
        tender.scopeOfWork.forEach(f => {
          const p = path.join(__dirname, '..', f);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        });
        updatedFields.scopeOfWork = req.files.scopeOfWork.map(f => f.path);
      } else {
        updatedFields.scopeOfWork = tender.scopeOfWork;
      }

      if (req.files.rfq?.length > 0) {
        tender.rfq.forEach(f => {
          const p = path.join(__dirname, '..', f);
          if (fs.existsSync(p)) fs.unlinkSync(p);
        });
        updatedFields.rfq = req.files.rfq.map(f => f.path);
      } else {
        updatedFields.rfq = tender.rfq;
      }
    }

    const updatedTender = await Tender.findByIdAndUpdate(id, updatedFields, { new: true });
    res.status(200).json({
      message: "Tender updated successfully",
      data: updatedTender,
    });
  } catch (error) {
    console.error("Tender update error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ✅ SUPPLIER INTEREST
// controllers/TenderController.js

const updateInterestStatus = async (req, res) => {
  try {
    const { tenderId, supplierId } = req.params; // supplierId = subdocument _id
    const { status } = req.body;

    const tender = await Tender.findById(tenderId);
    if (!tender) return res.status(404).json({ message: "Tender not found" });

    // Find the supplier interest by its _id (subdocument)
    const supplierEntry = tender.interestedSuppliers.id(supplierId);

    if (!supplierEntry) {
      return res.status(404).json({ message: "Supplier interest not found" });
    }

    supplierEntry.status = status;
    await tender.save();

    res.status(200).json({
      message: `Interest ${status.toLowerCase()} successfully`,
      data: tender,
    });
  } catch (error) {
    console.error("Error updating interest status:", error);
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};

const getInterestedTenders = async (req, res) => {
  try {
    const tenders = await Tender.find({ "interestedSuppliers.0": { $exists: true } })
      .select("projectName organisation interestedSuppliers publishingDate")
      .populate("interestedSuppliers.supplierId", "supplierName"); // optional

    res.status(200).json({
      message: "Interested tenders fetched",
      data: tenders,
    });
  } catch (error) {
    console.error("Error in getInterestedTenders:", error);
    res.status(500).json({
      message: "Error fetching interested tenders",
      error: error.message,
    });
  }
};



const getAllQuotations = async (req, res) => {
  try {
    const tenders = await Tender.find({ "interestedSuppliers.quotation": { $exists: true, $ne: "" } });
    res.status(200).json({ message: "Quotations fetched", data: tenders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotations", error: error.message });
  }
};

const getQuotationById = async (req, res) => {
  try {
    const { tenderId, supplierId } = req.params;
    const tender = await Tender.findById(tenderId);
    if (!tender) return res.status(404).json({ message: "Tender not found" });

    const supplierEntry = tender.interestedSuppliers.find(
      s => s.supplierId.toString() === supplierId && s.quotation
    );
    if (!supplierEntry) return res.status(404).json({ message: "Quotation not found" });

    res.status(200).json({
      projectName: tender.projectName,
      organisation: tender.organisation,
      supplierName: supplierEntry.supplierName,
      publishingDate: tender.publishingDate,
      quotation: supplierEntry.quotation,
      status: supplierEntry.status,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotation", error: error.message });
  }
};

const getQuotationsByTender = async (req, res) => {
  try {
    const { tenderId } = req.params;

    const tender = await Tender.findById(tenderId)
      .select("projectName organisation interestedSuppliers")
      .populate("interestedSuppliers.supplierId", "supplierName");

    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }

    // Filter only approved quotations
    const quotations = tender.interestedSuppliers
      .filter(supplier => supplier.status === "Approved" && supplier.quotation)
      .map(supplier => ({
        _id: supplier._id,
        supplierId: supplier.supplierId,
        supplierName: supplier.supplierName || supplier.supplierId?.supplierName,
        quotation: supplier.quotation,
        status: supplier.status,
      }));

    res.status(200).json({
      message: "Quotations fetched successfully",
      data: quotations,
    });
  } catch (error) {
    console.error("Error fetching quotations by tender:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const selectQuotation = async (req, res) => {
  try {
    const { tenderId, quotationId } = req.params;

    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }

    // Reset all selected flags
    tender.interestedSuppliers.forEach(supplier => {
      supplier.selected = false;
    });

    // Set the selected one
    const supplierEntry = tender.interestedSuppliers.id(quotationId);
    if (!supplierEntry) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    supplierEntry.selected = true;

    await tender.save();

    res.status(200).json({
      message: "Supplier quotation selected successfully",
    });
  } catch (error) {
    console.error("Error selecting quotation:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getSelectedQuotation = async (req, res) => {
  try {
    const { tenderId } = req.params;

    const tender = await Tender.findById(tenderId)
      .select("projectCode projectName organisation projectTitle items interestedSuppliers")
      .populate("interestedSuppliers.supplierId", "supplierName");

    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }

    // Find selected supplier
    const selectedSupplier = tender.interestedSuppliers.find(s => s.selected);

    if (!selectedSupplier || !selectedSupplier.quotation) {
      return res.status(404).json({ 
        message: "No selected quotation found for this tender" 
      });
    }

    let quotationData = {};
    try {
      quotationData = typeof selectedSupplier.quotation === 'string'
        ? JSON.parse(selectedSupplier.quotation)
        : selectedSupplier.quotation;
    } catch (e) {
      console.warn("Failed to parse selected quotation:", e);
      return res.status(500).json({ message: "Invalid quotation data" });
    }

    // Combine with supplier's items
    const items = (quotationData.items || []).map(item => ({
      itemCode: item.itemCode,
      itemName: item.itemName,
      partNo: item.partNo,
      manufacturer: item.manufacturer,
      uom: item.uom,
      qty: item.qty,
      unitPrice: item.unitPrice,
      total: (item.qty * item.unitPrice).toFixed(2),
      marginType: null, // Default to null
      marginValue: 0,
      marginTotal: 0
    }));

    // Match with DB items to get margin settings
    const finalItems = items.map((item, idx) => {
      const dbItem = tender.items.find(i => i.itemCode === item.itemCode);
      if (!dbItem) return item;

      let marginTotal = 0;
      const marginValue = parseFloat(dbItem.marginValue || 0);

      if (dbItem.marginType === 'Percentage') {
        marginTotal = (parseFloat(item.total) * marginValue / 100);
      } else if (dbItem.marginType === 'Fixed Amount') {
        marginTotal = marginValue;
      }

      return {
        ...item,
        marginType: dbItem.marginType,
        marginValue: dbItem.marginValue,
        marginTotal: marginTotal.toFixed(2)
      };
    });

    // Grand totals
    const grandTotal = finalItems.reduce((sum, item) => sum + parseFloat(item.total), 0);
    const grandTotalWithMargin = finalItems.reduce((sum, item) => {
      return sum + parseFloat(item.total) + parseFloat(item.marginTotal);
    }, 0);

    const response = {
      projectName: tender.projectName,
      projectCode: tender.projectCode,
      organisation: tender.organisation,
      projectTitle: tender.projectTitle,
      supplierName: selectedSupplier.supplierName,
      submittedAt: selectedSupplier.interestedDate,
      items: finalItems,
      total: quotationData.total || "0.00",
      notes: quotationData.notes || "",
      grandTotal: grandTotal.toFixed(2),
      grandTotalWithMargin: grandTotalWithMargin.toFixed(2)
    };

    res.status(200).json({
      message: "Selected quotation retrieved successfully",
      data: response
    });

  } catch (error) {
    console.error("Error fetching selected quotation:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
// Save margin values for items in a tender
// Save margin values for items in a tender
const updateItemMargin = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { itemCode, marginType, marginValue } = req.body;

    if (!itemCode || !marginType || marginValue === undefined) {
      return res.status(400).json({ message: "itemCode, marginType, and marginValue are required" });
    }

    const tender = await Tender.findById(tenderId);
    if (!tender) {
      return res.status(404).json({ message: "Tender not found" });
    }

    const item = tender.items.find(i => i.itemCode === itemCode);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🚨 FIX: Get total from supplier's quotation, not from DB item (which may lack unitPrice)
    const selectedSupplier = tender.interestedSuppliers.find(s => s.selected);
    if (!selectedSupplier || !selectedSupplier.quotation) {
      return res.status(400).json({ message: "No selected supplier quotation found" });
    }

    let quotationData;
    try {
      quotationData = typeof selectedSupplier.quotation === 'string'
        ? JSON.parse(selectedSupplier.quotation)
        : selectedSupplier.quotation;
    } catch (e) {
      return res.status(500).json({ message: "Failed to parse quotation" });
    }

    const quotedItem = (quotationData.items || []).find(i => i.itemCode === itemCode);
    if (!quotedItem) {
      return res.status(404).json({ message: "Item not found in quotation" });
    }

    const total = quotedItem.qty * quotedItem.unitPrice;

    // Calculate marginTotal
    let marginTotal = 0;

    if (marginType === 'Percentage') {
      marginTotal = (total * marginValue / 100);
    } else if (marginType === 'Fixed Amount') {
      marginTotal = marginValue;
    }

    // Update DB item
    item.marginType = marginType;
    item.marginValue = marginValue;
    item.marginTotal = marginTotal;

    await tender.save();

    res.status(200).json({
      message: "Margin updated successfully",
      data: {
        marginTotal: marginTotal.toFixed(2)
      }
    });

  } catch (error) {
    console.error("Error updating margin:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
const getMyQuotations = async (req, res) => {
  try {
    const { supplierId } = req.params;

    if (!supplierId || typeof supplierId !== "string") {
      return res.status(400).json({ message: "Valid supplier ID is required" });
    }

    let supplierObjectId;
    try {
      // ✅ Always use 'new' to avoid TypeError
      supplierObjectId = new require("mongoose").Types.ObjectId(supplierId);
    } catch (err) {
      return res.status(400).json({ message: "Invalid supplier ID format" });
    }

    const tenders = await Tender.find({
      "interestedSuppliers": {
        $elemMatch: {
          "supplierId": supplierObjectId, // Now safely matches ObjectId
          "quotation": { $exists: true, $ne: null, $ne: "" }
        }
      }
    })
      .select("projectCode projectName projectTitle publishingDate interestedSuppliers")
      .populate("interestedSuppliers.supplierId", "supplierName");

    const myQuotations = [];

    for (const tender of tenders) {
      for (const s of tender.interestedSuppliers) {
        // Safely compare ObjectIds using .equals()
        if (
          s.supplierId &&
          s.supplierId.equals(supplierObjectId) &&
          s.quotation &&
          s.quotation.trim() !== ""
        ) {
          myQuotations.push({
            _id: s._id,
            tenderId: tender._id,
            projectCode: tender.projectCode,
            projectName: tender.projectName,
            projectTitle: tender.projectTitle,
            publishingDate: tender.publishingDate,
            quotation: s.quotation,
            status: s.status,
          });
        }
      }
    }

    res.status(200).json({
      message: "Your quotations retrieved successfully",
       myQuotations,
    });
  } catch (error) {
    console.error("Error fetching my quotations:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
const updateMyQuotation = async (req, res) => {
  try {
    const { tenderId, supplierId, quotationId } = req.params;
    const { quotation } = req.body;

    if (!quotation) {
      return res.status(400).json({ message: "Quotation is required" });
    }

    const tender = await Tender.findById(tenderId);
    if (!tender) return res.status(404).json({ message: "Tender not found" });

    const supplierEntry = tender.interestedSuppliers.id(quotationId);
    if (!supplierEntry) return res.status(404).json({ message: "Quotation not found" });

    if (supplierEntry.supplierId.toString() !== supplierId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (supplierEntry.status !== "Approved") {
      return res.status(400).json({ message: "Cannot edit quotation in current status" });
    }

    supplierEntry.quotation = quotation;
    await tender.save();

    res.status(200).json({
      message: "Quotation updated successfully",
      data: supplierEntry,
    });
  } catch (error) {
    console.error("Error updating quotation:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
module.exports = {
  createTender,
  getAllDrafts,
  getDraftById,
  updateDraft,
  deleteDraft,
  markDraftAsReady,
  publishDraft,
  getAllTenders,
  getTenderById,
  getTenderByCategory,
  deleteTender,
  downloadTenderFile,
  updateTender,
  updateInterestStatus,
  getInterestedTenders,
  getAllQuotations,
  getQuotationById,
  getQuotationsByTender,
  selectQuotation,
  getSelectedQuotation,
  updateItemMargin,
  getMyQuotations,
  updateMyQuotation
  
  
};