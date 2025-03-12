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
const upload = require('../middleware/fileupload');



// Product Routes
router.post("/products",
  protect,
  authorize("admin", "user"),
  upload.array('images', 5),  // Changed from single('image') to array('images')
  createProduct
);

router.put("/products/:id",
  protect,
  authorize("admin", "user"),
  upload.array('images', 5),  // Changed from single('image') to array('images')
  updateProduct
);

router.get("/products",
    protect,
    authorize("admin", "user"),
    getProducts
);

router.get("/products/:id",
    protect,
    authorize("admin", "user"),
    getProductById
);

router.delete("/products/:id",
    protect,
    authorize("admin"),  // Only allow admins to delete
    deleteProduct
);

module.exports = router;