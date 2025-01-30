const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", required: true
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Card", "Mobile Money"],
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Delivered", "Failed"],
        default: "Pending"
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Sale", saleSchema);