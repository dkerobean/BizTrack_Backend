const express = require("express");
const router = express.Router();
const {
    createSale,
    updateSale,
    deleteSale,
    getSales,
    generateInvoice
    } = require("../controllers/salesController");
const { protect, authorize } = require("../middleware/authMiddleware");

// create a new sale
router.post("/", protect, createSale);

// edit a sale
router.put("/:id", protect, updateSale);

// delete a sale
router.delete("/:id", protect, adminOnly, deleteSale);

// get sales
router.get("/", protect, getSales);

// generate invoice
router.get("/:id/invoice", protect, generateInvoice);


module.exports = router;