const express = require("express")
const {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  registerSubadmin,
  getSubadmins,
  updateSubadmin,
  deleteSubadmin,
  changePassword,
  // Role management functions
  getSubadminsForRole,
  getSubAdminPermissions,
  setSubAdminPermissions,
  getUserPermissions,
} = require("../controllers/adminController")
const { protect, adminMiddleware } = require("../middleware/authMiddleware")

const router = express.Router()

// Admin or subadmin register
router.post("/register", registerAdmin)

// Login
router.post("/login", loginAdmin)

// Profile
router.get("/profile", protect, getProfile)
router.put("/profile", protect, updateProfile)
router.put("/change-password", protect, changePassword)

// Register subadmin (only if logged in)
router.post("/subadmin", registerSubadmin)
router.get("/viewsubadmins", getSubadmins)
router.put("/updatesubadmin/:id", protect, updateSubadmin)
// DELETE: delete a subadmin
router.delete("/deletesubadmin/:id", protect, deleteSubadmin)

// ===== ROLE MANAGEMENT ROUTES (Admin only) =====

// Get all sub-admins for role management (Admin only)
router.get("/subadmins", protect, adminMiddleware, getSubadminsForRole)

// Get permissions for a specific sub-admin (Admin only)
router.get("/permissions/:subAdminId", protect, adminMiddleware, getSubAdminPermissions)

// Set permissions for a sub-admin (Admin only)
router.post("/permissions", protect, adminMiddleware, setSubAdminPermissions)

// Get current user's permissions (for sidebar) - Both admin and subadmin
router.get("/user-permissions", protect, getUserPermissions)

module.exports = router
