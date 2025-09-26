const Admin = require("../models/Admin")
const SubAdminPermission = require("../models/SubAdminPermission")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "30d" })
}

// Register admin or subadmin
const registerAdmin = async (req, res) => {
  const { username, email, password, role } = req.body
  const adminExists = await Admin.findOne({ email })
  if (adminExists) return res.status(400).json({ message: "Admin already exists" })
  const hashedPassword = await bcrypt.hash(password, 10)
  const newAdmin = await Admin.create({
    username,
    email,
    password: hashedPassword,
    role: role || "admin",
  })
  if (newAdmin) {
    res.status(201).json({
      _id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      role: newAdmin.role,
      token: generateToken(newAdmin._id),
    })
  } else {
    res.status(400).json({ message: "Invalid admin data" })
  }
}

// Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await Admin.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "24h" },
    )

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role, // Include role in response
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

// Profile view
const getProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password")
  if (admin) {
    res.json(admin)
  } else {
    res.status(404).json({ message: "Admin not found" })
  }
}

// Update profile
const updateProfile = async (req, res) => {
  const admin = await Admin.findById(req.admin._id)
  if (admin) {
    admin.username = req.body.username || admin.username
    admin.email = req.body.email || admin.email
    if (req.body.password) {
      admin.password = await bcrypt.hash(req.body.password, 10)
    }
    const updatedAdmin = await admin.save()
    res.json({
      _id: updatedAdmin._id,
      username: updatedAdmin.username,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
    })
  } else {
    res.status(404).json({ message: "Admin not found" })
  }
}

// Create subadmin (only if logged-in admin)
const registerSubadmin = async (req, res) => {
  const { username, email, password } = req.body
  const existing = await Admin.findOne({ email })
  if (existing) return res.status(400).json({ message: "Subadmin already exists" })
  const hashedPassword = await bcrypt.hash(password, 10)
  const subadmin = await Admin.create({
    username,
    email,
    password: hashedPassword,
    role: "subadmin",
  })
  if (subadmin) {
    res.status(201).json({
      _id: subadmin._id,
      username: subadmin.username,
      email: subadmin.email,
      role: subadmin.role,
      token: generateToken(subadmin._id),
    })
  } else {
    res.status(400).json({ message: "Invalid subadmin data" })
  }
}

// Get all subadmins
const getSubadmins = async (req, res) => {
  try {
    const subadmins = await Admin.find({ role: "subadmin" }).select("-password")
    res.json(subadmins)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

const updateSubadmin = async (req, res) => {
  try {
    const { id } = req.params
    const { email, username } = req.body
    const subadmin = await Admin.findById(id)
    if (!subadmin || subadmin.role !== "subadmin") {
      return res.status(404).json({ message: "Subadmin not found" })
    }
    subadmin.email = email || subadmin.email
    subadmin.username = username || subadmin.username
    await subadmin.save()
    res.status(200).json({ message: "Subadmin updated successfully" })
  } catch (error) {
    console.error("Update subadmin error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete Subadmin
const deleteSubadmin = async (req, res) => {
  try {
    const { id } = req.params
    const subadmin = await Admin.findById(id)
    if (!subadmin || subadmin.role !== "subadmin") {
      return res.status(404).json({ message: "Subadmin not found" })
    }
    await subadmin.deleteOne()

    // Also delete their permissions
    await SubAdminPermission.findOneAndDelete({ subAdminId: id })

    res.status(200).json({ message: "Subadmin deleted successfully" })
  } catch (error) {
    console.error("Delete subadmin error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body
  try {
    const admin = await Admin.findById(req.admin._id)
    if (!admin || !admin.password) {
      return res.status(404).json({ message: "Admin not found or password missing" })
    }
    const isMatch = await bcrypt.compare(oldPassword, admin.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    admin.password = hashedPassword
    await admin.save()
    res.json({ message: "Password changed successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// ===== ROLE MANAGEMENT FUNCTIONS =====

// Get all sub-admins for role management dropdown
const getSubadminsForRole = async (req, res) => {
  try {
    const subAdmins = await Admin.find({ role: "subadmin" }).select("username email _id")
    res.json(subAdmins)
  } catch (error) {
    console.error("Error fetching sub-admins:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get permissions for a specific sub-admin
const getSubAdminPermissions = async (req, res) => {
  try {
    const { subAdminId } = req.params

    const permission = await SubAdminPermission.findOne({ subAdminId })

    if (!permission) {
      return res.json({
        permissions: {
          manageSuppliers: false,
          masterTables: false,
          subAdmin: false,
          settings: false,
        },
      })
    }

    res.json({ permissions: permission.permissions })
  } catch (error) {
    console.error("Error fetching permissions:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Set permissions for a sub-admin
const setSubAdminPermissions = async (req, res) => {
  try {
    const { subAdminId, permissions } = req.body

    // Validate sub-admin exists
    const subAdmin = await Admin.findById(subAdminId)
    if (!subAdmin || subAdmin.role !== "subadmin") {
      return res.status(404).json({ message: "Sub-admin not found" })
    }

    // Update or create permissions
    const existingPermission = await SubAdminPermission.findOne({ subAdminId })

    if (existingPermission) {
      existingPermission.permissions = permissions
      await existingPermission.save()
    } else {
      const newPermission = new SubAdminPermission({
        subAdminId,
        permissions,
      })
      await newPermission.save()
    }

    res.json({ message: "Permissions updated successfully" })
  } catch (error) {
    console.error("Error updating permissions:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get current user's permissions (for sidebar)
// controllers/adminController.js

const getUserPermissions = async (req, res) => {
  try {
    const user = await Admin.findById(req.admin._id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    let permissions = {}

    if (user.role === "admin") {
      // ✅ Grant full access to admin
      permissions = {
        manageSuppliers: true,
        manageTenders: true,
        masterTables: true,
        subAdmin: true,
        settings: true,
        dashboard: true,
      };
    } else if (user.role === "subadmin") {
      // Subadmin: fetch from database
      const permission = await SubAdminPermission.findOne({ subAdminId: user._id })
      permissions = permission
        ? permission.permissions
        : {
            manageSuppliers: false,
            manageTenders: false,
            masterTables: false,
            subAdmin: false,
            settings: false,
            dashboard: false,
          }
    } else {
      // Optional: handle other roles (e.g., supplier)
      permissions = {}
    }

    res.json({
      role: user.role,
      permissions,
    })
  } catch (error) {
    console.error("Error fetching user permissions:", error)
    res.status(500).json({ message: "Server error" })
  }
}
module.exports = {
  registerAdmin,
  loginAdmin,
  getProfile,
  updateProfile,
  registerSubadmin,
  getSubadmins,
  deleteSubadmin,
  updateSubadmin,
  changePassword,
  // Role management functions
  getSubadminsForRole,
  getSubAdminPermissions,
  setSubAdminPermissions,
  getUserPermissions,
}
