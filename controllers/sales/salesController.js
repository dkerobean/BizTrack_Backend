const Sale = require("../../models/salesModel");
const Product = require("../../models/productModel");
const PDFDocument = require("pdfkit");

// Create a Sale
exports.createSale = async (req, res) => {
    try {
        const { customerId, items, paymentMethod, totalAmount } = req.body;


        // Reduce stock
        for (let item of items) {
            let product = await Product.findById(item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({ message: "Insufficient stock" });
            }
            product.stock -= item.quantity;
            await product.save();
        }

        const sale = await Sale.create({ customerId, items, totalAmount, paymentMethod });
        res.status(201).json(sale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Edit Sale
exports.updateSale = async (req, res) => {
    try {
        const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Sale
exports.deleteSale = async (req, res) => {
    try {
        await Sale.findByIdAndDelete(req.params.id);
        res.json({ message: "Sale deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Filter Sales
exports.getSales = async (req, res) => {
    try {
        const { startDate, endDate, productId } = req.query;
        let filter = {};
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (productId) {
            filter["items.productId"] = productId;
        }
        const sales = await Sale.find(filter).populate("customerId items.productId");
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate PDF Invoice
exports.generateInvoice = async (req, res) => {
    try {
        const sale = await Sale.findById(req.params.id).populate("items.productId customerId");
        if (!sale) return res.status(404).json({ message: "Sale not found" });

        const doc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="invoice_${sale._id}.pdf"`);

        doc.text(`Invoice #${sale._id}`, { align: "center" });
        doc.text(`Date: ${new Date(sale.date).toLocaleDateString()}`);
        doc.text(`Customer ID: ${sale.customerId._id}`);

        sale.items.forEach(item => {
            doc.text(`${item.productId.name} - Qty: ${item.quantity} - $${item.price}`);
        });

        doc.text(`Total Amount: $${sale.totalAmount}`, { align: "right" });
        doc.pipe(res);
        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};