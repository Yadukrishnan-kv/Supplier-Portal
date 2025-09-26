const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]
      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_KEY)
      // Find admin by decoded token id
      req.admin = await Admin.findById(decoded.id).select("-password")
      if (!req.admin) {
        return res.status(401).json({ message: "Not authorized, admin not found" })
      }
      next()
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" })
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" })
  }
}

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
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = { protect, adminMiddleware }
