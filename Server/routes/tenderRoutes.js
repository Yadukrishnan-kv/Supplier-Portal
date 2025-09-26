// routes/tenderRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const TenderController = require("../controllers/TenderController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|jpg|jpeg|png/i;
  const ext = allowed.test(path.extname(file.originalname));
  const mime = allowed.test(file.mimetype);
  ext && mime ? cb(null, true) : cb(new Error("Only PDF, JPG, JPEG, PNG allowed"));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadFields = upload.fields([
  { name: "scopeOfWork", maxCount: 10 },
  { name: "rfq", maxCount: 10 },
]);

// Routes
router.post("/add", uploadFields, TenderController.createTender);
// Get draft by ID
router.get("/drafts/:id", TenderController.getDraftById);
router.get("/drafts", TenderController.getAllDrafts);
router.put("/draft/:id/ready", TenderController.markDraftAsReady);
router.put("/draft/:id/publish", TenderController.publishDraft);
router.put("/drafts/:id", uploadFields, TenderController.updateDraft);
router.delete("/drafts/:id", TenderController.deleteDraft);

router.get("/", TenderController.getAllTenders);
router.get("/view/:id", TenderController.getTenderById);
router.get("/category/:category", TenderController.getTenderByCategory);
router.delete("/:id", TenderController.deleteTender);
router.put("/:id", uploadFields, TenderController.updateTender);
router.get("/:tenderId/download/:fileType/:fileIndex", TenderController.downloadTenderFile);

router.put("/:tenderId/supplier/:supplierId/status", TenderController.updateInterestStatus);
// routes/tenderRoutes.js

router.get("/interested", TenderController.getInterestedTenders);
router.get("/quotations", TenderController.getAllQuotations);
router.get("/supplier/:supplierId/quotations", TenderController.getMyQuotations);
router.put("/:tenderId/supplier/:supplierId/quotation/:quotationId",TenderController.updateMyQuotation);
router.get("/:tenderId/supplier/:supplierId/quotation", TenderController.getQuotationById);
router.get("/:tenderId/quotations", TenderController.getQuotationsByTender);
router.put("/:tenderId/quotation/:quotationId/select",TenderController.selectQuotation);
router.get("/:tenderId/selected-quotation", TenderController.getSelectedQuotation);
router.post("/:tenderId/update-margin", TenderController.updateItemMargin);
module.exports = router;