const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/product/productController');
const { protect, authorize } = require("../middleware/authMiddleware");


// Product Routes
router.post("/product/create", protect, authorize("admin", "user"), createProduct);
router.get("/products", getProducts); // Get all products
router.get("/products/:id", getProductById); // Get a single product by ID
router.put("/products/edit/:id", updateProduct); // Update a product by ID
router.delete("/products/:id", deleteProduct); // Delete a product by ID

module.exports = router;