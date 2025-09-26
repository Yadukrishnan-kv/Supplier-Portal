const SupplierRequest = require("../models/SupplierRequest");
const AdminCollection = require("../models/Admin");

const Tender = require("../models/Tender");

const bcrypt = require("bcryptjs");

const createSupplierRequest = async (req, res) => {
  try {
    const {
      companyName,
      address,
      postalCode,
      country,
      state,
      city,
      telephone,
      emailAddress,
      password,
      confirmPassword,
      firstName,
      lastName,
      designation,
      contactEmailAddress,
      mobile,
      category,
      subCategory,
    } = req.body

    const requiredFields = [
      "companyName",
      "address",
      "postalCode",
      "country",
      "state",
      "city",
      "telephone",
      "emailAddress",
      "password",
      "confirmPassword",
      "firstName",
      "lastName",
      "designation",
      "contactEmailAddress",
      "mobile",
      "category",
      "subCategory",
    ]
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required`, field })
      }
    }

    if (!req.files || !req.files.companyTradeLicense || !req.files.vatRegistrationCertificate) {
      return res.status(400).json({
        message: "Both companyTradeLicense and vatRegistrationCertificate files are required",
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" })
    }

    const existingSupplier = await SupplierRequest.findOne({ emailAddress })
    if (existingSupplier) {
      return res.status(400).json({ message: "Supplier with this email already exists" })
    }

    const existingAdmin = await AdminCollection.findOne({ email: emailAddress })
    if (existingAdmin) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newRequest = new SupplierRequest({
      companyName,
      address,
      postalCode,
      country,
      state,
      city,
      telephone,
      emailAddress,
      password: hashedPassword,
      companyTradeLicense: req.files.companyTradeLicense[0].path,
      vatRegistrationCertificate: req.files.vatRegistrationCertificate[0].path,
      firstName,
      lastName,
      designation,
      contactEmailAddress,
      mobile,
      category,
      subCategory,
      // status will default to "Pending" as per schema
    })

    await newRequest.save()

    const newAdminEntry = new AdminCollection({
      username: companyName,
      email: emailAddress,
      password: hashedPassword,
      role: "supplier",
    })

    await newAdminEntry.save()

    const responseData = newRequest.toObject()
    delete responseData.password

    res.status(201).json({
      message: "Supplier request submitted successfully",
      data: responseData,
    })
  } catch (error) {
    console.error("Supplier creation error:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}

const getAllSupplierRequests = async (req, res) => {
  try {
    const requests = await SupplierRequest.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      message: "Supplier requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching supplier requests:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getActiveSupplierRequests = async (req, res) => {
  try {
    const requests = await SupplierRequest.find({ status: "Active" }).select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      message: "Active supplier requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching active supplier requests:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getInactiveSupplierRequests = async (req, res) => {
  try {
    const requests = await SupplierRequest.find({ status: "Inactive" })
      .populate("inactivatedBy", "username")
      .select("-password")
      .sort({ inactivatedAt: -1 });
    res.status(200).json({
      message: "Inactive supplier requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching inactive supplier requests:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getSupplierRequestById = async (req, res) => {
  try {
    const request = await SupplierRequest.findById(req.params.id).select("-password");
    if (!request) {
      return res.status(404).json({ message: "Supplier request not found" });
    }
    res.status(200).json({ message: "Supplier request retrieved successfully", data: request });
  } catch (error) {
    console.error("Error fetching supplier request by ID:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const updateSupplierRequest = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedRequest = await SupplierRequest.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Supplier request not found" });
    }
    res.status(200).json({ message: "Supplier request updated successfully", data: updatedRequest });
  } catch (error) {
    console.error("Error updating supplier request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const activateSupplierRequest = async (req, res) => {
  try {
    const updatedRequest = await SupplierRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: "Active",
        inactiveReason: null,
        inactivatedBy: null,
        inactivatedAt: null,
      },
      { new: true, runValidators: true }
    ).select("-password"); // Select to exclude password from response

    if (!updatedRequest) {
      return res.status(404).json({ message: "Supplier request not found" });
    }
    res.status(200).json({ message: "Supplier request activated successfully", data: updatedRequest });
  } catch (error) {
    console.error("Error activating supplier:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const inactivateSupplierRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const adminId = req.admin ? req.admin._id : null; // Assuming req.admin is populated by middleware

    if (!reason) {
      return res.status(400).json({ message: "Reason is required for inactivation" });
    }

    const updatedRequest = await SupplierRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: "Inactive",
        inactiveReason: reason,
        inactivatedBy: adminId,
        inactivatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).select("-password"); // Select to exclude password from response

    if (!updatedRequest) {
      return res.status(404).json({ message: "Supplier request not found" });
    }
    res.status(200).json({ message: "Supplier request inactivated successfully", data: updatedRequest });
  } catch (error) {
    console.error("Error inactivating supplier:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const deleteSupplierRequest = async (req, res) => {
  try {
    const deletedRequest = await SupplierRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Supplier request not found" });
    }
    res.status(200).json({ message: "Supplier request deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier request:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const expressInterest = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { supplierId, supplierName } = req.body;

    const tender = await Tender.findById(tenderId);
    if (!tender) return res.status(404).json({ message: "Tender not found" });

    // Check if supplier already expressed interest
    const alreadyInterested = tender.interestedSuppliers.some(
      s => s.supplierId.toString() === supplierId
    );
    if (alreadyInterested) {
      return res.status(400).json({ message: "You have already expressed interest" });
    }

    tender.interestedSuppliers.push({ supplierId, supplierName });
    await tender.save();

    res.status(200).json({ message: "Interest expressed successfully", tender });
  } catch (error) {
    res.status(500).json({ message: "Error expressing interest", error: error.message });
  }
};
const sendQuotation = async (req, res) => {
  try {
    const { tenderId, supplierId } = req.params;
    const { quotation } = req.body; // could be text or uploaded file path

    const tender = await Tender.findById(tenderId);
    if (!tender) return res.status(404).json({ message: "Tender not found" });

    const supplierEntry = tender.interestedSuppliers.find(
      s => s.supplierId.toString() === supplierId
    );
    if (!supplierEntry || supplierEntry.status !== "Approved") {
      return res.status(400).json({ message: "You are not approved to send a quotation" });
    }

    supplierEntry.quotation = quotation;
    await tender.save();

    res.status(200).json({ message: "Quotation sent successfully", tender });
  } catch (error) {
    res.status(500).json({ message: "Error sending quotation", error: error.message });
  }
};
const getPendingTendersForSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const tenders = await Tender.find({
      "interestedSuppliers.supplierId": supplierId,
      "interestedSuppliers.status": "Pending"
    });
    res.status(200).json({ data: tenders });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending tenders", error: error.message });
  }
};
// Supplier view approved tenders
const getApprovedTendersForSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const tenders = await Tender.find({ "interestedSuppliers.supplierId": supplierId, "interestedSuppliers.status": "Approved" });
    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching approved tenders", error: error.message });
  }
};

// Supplier view rejected tenders
const getRejectedTendersForSupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const tenders = await Tender.find({ "interestedSuppliers.supplierId": supplierId, "interestedSuppliers.status": "Rejected" });
    res.status(200).json(tenders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rejected tenders", error: error.message });
  }
};

const getSupplierProfile = async (req, res) => {
  try {
    // Check role
    if (!req.admin || req.admin.role !== "supplier") {
      return res.status(403).json({ message: "Access denied. Supplier role required." });
    }

    // Fetch supplier profile by email from SupplierRequest
    const supplierProfile = await SupplierRequest.findOne({
      emailAddress: req.admin.email,
    }).select("-password");

    if (!supplierProfile) {
      return res.status(404).json({ message: "Supplier profile not found" });
    }

    res.status(200).json({
      message: "Supplier profile fetched successfully",
      data: supplierProfile,
    });
  } catch (error) {
    console.error("Error fetching supplier profile:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
module.exports = {
  createSupplierRequest,
  getAllSupplierRequests,
  getActiveSupplierRequests,
  getInactiveSupplierRequests,
  getSupplierRequestById,
  updateSupplierRequest,
  activateSupplierRequest,
  inactivateSupplierRequest,
  deleteSupplierRequest,
    expressInterest,
    sendQuotation,getPendingTendersForSupplier,
    getApprovedTendersForSupplier,
  getRejectedTendersForSupplier,getSupplierProfile
};
