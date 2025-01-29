const mongoose = require("mongoose");

// Define Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lowStockAlert: {
      type: Number,
      default: 10, // Threshold for low stock alerts
    },
    category: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      unique: true, // Stock Keeping Unit for tracking
      required: true,
    },
    images: {
      type: [String], // Array of strings for image URLs
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who added the product
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true, // Indicates if the product is active or archived
    },
  },
  { timestamps: true }
);

// Method to reduce stock after a sale
productSchema.methods.reduceStock = function (quantity) {
  if (this.stock < quantity) {
    throw new Error("Insufficient stock");
  }
  this.stock -= quantity;
  return this.save();
};

// Export the Product model
module.exports = mongoose.model("Product", productSchema);