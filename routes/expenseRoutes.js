const express = require('express');
const {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  getExpenseReport,
  getExpenseTrends
} = require('../controllers/expense/expenseController');

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get Expense Report
router.get('/report', protect, getExpenseReport);

// Get Expense Trend
router.get("/trend", protect, getExpenseTrends);

// Create an Expense
router.post('/', protect, authorize("admin", "user"), createExpense);

// Get All Expenses
router.get('/', protect, getAllExpenses);

// Get a Single Expense
router.get('/:id', protect, getExpense);

// Update an Expense
router.put('/:id', protect, updateExpense);

// Delete an Expense
router.delete('/:id', protect, deleteExpense);



module.exports = router;