const router = require("express").Router();

// Routes
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const brandRoutes = require("./brandRoutes");
const categoryRoutes = require("./categoryRoutes");

// End Points
router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);

module.exports = router;