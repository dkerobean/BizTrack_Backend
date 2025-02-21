const Product = require('../../models/productModel');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      lowStockAlert,
      category,
      sku,
      images,
      organizationId
    } = req.body;

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "organizationId is required" });
    }

    if (organizationId !== req.user.organizationId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to create product for this organization" });
    }

    // Create a new product instance
    const product = new Product({
      name,
      description,
      price,
      stock,
      lowStockAlert,
      category,
      sku,
      images,
      organizationId,
      createdBy: req.user._id,
    });

    // Save the product to the database
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all products belonging to the logged-in user's organization
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ organizationId: req.user.organizationId }); // Fetch products by organization
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single product by ID, ensuring it belongs to the logged-in user's organization
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, organizationId: req.user.organizationId });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a product by ID, ensuring it belongs to the logged-in user's organization
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: id, organizationId: req.user.organizationId },
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a product by ID, ensuring it belongs to the logged-in user's organization
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, organizationId: req.user.organizationId });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
