const Admin = require("../models/Admin")

const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.admin) {
      return res.status(401).json({ message: "Not authorized" })
    }

    if (req.admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin role required." })
    }

    next()
  } catch (error) {
    console.error("Admin middleware error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = adminMiddleware
 