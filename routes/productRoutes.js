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
const multer = require('multer');
const upload = multer();


// Product Routes
router.post("/product/create",
    upload.any(),
    protect,
    authorize("admin", "user"),
    createProduct);
router.get("/products", protect, authorize("admin", "user"), getProducts);
router.get("/products/:id", getProductById);
router.put("/products/edit/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

module.exports = router;