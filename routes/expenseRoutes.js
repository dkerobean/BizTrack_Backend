const express = require('express');
const {
  createExpense,
  getAllExpenses,
  getExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expense/expenseController');

const router = express.Router();

// Create an Expense
router.post('/', createExpense);

// Get All Expenses
router.get('/', getAllExpenses);

// Get a Single Expense
router.get('/:id', getExpense);

// Update an Expense
router.put('/:id', updateExpense);

// Delete an Expense
router.delete('/:id', deleteExpense);

module.exports = router;