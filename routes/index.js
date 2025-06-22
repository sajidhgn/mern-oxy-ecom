const router = require("express").Router();

// Routes
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const brandRoutes = require("./brand.routes");
const categoryRoutes = require("./category.routes");
const orderRoutes = require("./order.routes");

// End Points
router.use("/auth", authRoutes);
router.use("/product", productRoutes);
router.use("/order", orderRoutes);
router.use("/brand", brandRoutes);
router.use("/category", categoryRoutes);

router.get("/", (req, res) => {
    res.json({ message: "API is running" });
});

module.exports = router;