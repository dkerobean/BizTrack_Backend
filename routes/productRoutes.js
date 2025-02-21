const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/product/productController');

const { protect, authorize } = require("../middleware/authMiddleware");


// Product Routes
router.post("/product/create", protect, authorize("admin", "user"), createProduct);
router.get("/products", protect, authorize("admin", "user"), getProducts);
router.get("/products/:id", getProductById);
router.put("/products/edit/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;