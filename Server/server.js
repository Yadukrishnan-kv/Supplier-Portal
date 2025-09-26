const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files statically (optional, if you need to access files via URL)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/category", categoryRoutes);

const subCategoryRoutes = require("./routes/subCategoryRoutes");
app.use("/api/subcategory", subCategoryRoutes);

const supplierRoutes = require("./routes/supplierRequestRoutes");
app.use("/api/suppliers", supplierRoutes);

const tenderRoutes = require("./routes/tenderRoutes");
app.use("/api/tenders", tenderRoutes);

app.get("/api/ping", (req, res) => {
  res.send("Server is running!");
});

const port = process.env.PORT || 4000;
app.listen(port, (err) => {
  if (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }
  console.log(`Server is running on port ${port}`);
});
