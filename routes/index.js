const router = require("express").Router();

// Routes
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");

// End Points
router.use("/auth", authRoutes);
router.use("/product", productRoutes);

module.exports = router;