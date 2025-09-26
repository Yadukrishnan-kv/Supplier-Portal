const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const supplierController = require("../controllers/supplierRequestController");
const { protect } = require("../middleware/authMiddleware");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in uploads/ directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed"));
  }
};

// Initialize Multer with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Define fields for file uploads
const uploadFields = upload.fields([
  { name: "companyTradeLicense", maxCount: 1 },
  { name: "vatRegistrationCertificate", maxCount: 1 },
]);

router.post("/add", uploadFields, supplierController.createSupplierRequest);
router.get("/view", supplierController.getAllSupplierRequests);
router.get("/active", supplierController.getActiveSupplierRequests);
router.get("/inactive", supplierController.getInactiveSupplierRequests);
router.get("/view/:id", supplierController.getSupplierRequestById);
router.put("/update/:id", supplierController.updateSupplierRequest);
router.put("/activate/:id", protect, supplierController.activateSupplierRequest);
router.put("/inactivate/:id", protect, supplierController.inactivateSupplierRequest);
router.delete("/delete/:id", supplierController.deleteSupplierRequest);


router.post("/:tenderId/interest",supplierController. expressInterest);
router.post("/:tenderId/supplier/:supplierId/quotation",supplierController. sendQuotation);
router.get("/supplier/:supplierId/pending", supplierController.getPendingTendersForSupplier);
router.get("/supplier/:supplierId/approved",supplierController. getApprovedTendersForSupplier);
router.get("/supplier/:supplierId/rejected",supplierController. getRejectedTendersForSupplier);
router.get("/profile", protect,supplierController. getSupplierProfile);


module.exports = router;