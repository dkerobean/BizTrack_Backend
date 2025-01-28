const Expense = require('../../models/expenseModel');
const moment = require('moment');

// Create an Expense
exports.createExpense = async (req, res) => {
  try {
    const {
      description, amount, category, date, paymentMethod, notes, attachments, isRecurring, recurrencePeriod, recurrenceEndDate
    } = req.body;

    const userId = req.user._id;

    const expense = new Expense({
      description,
      amount,
      category,
      date,
      paymentMethod,
      notes,
      attachments,
      userId,
      isRecurring,
      recurrencePeriod,
      recurrenceEndDate
    });

    await expense.save();
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get All Expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, category, isRecurring } = req.query;

    const filters = { userId };
    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.$gte = new Date(startDate);
      if (endDate) filters.date.$lte = new Date(endDate);
    }
    if (category) {
      filters.category = category;
    }
    if (isRecurring) {
      filters.isRecurring = isRecurring === 'true';
    }

    const expenses = await Expense.find(filters).sort({ date: -1 });
    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get a Single Expense
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update an Expense
exports.updateExpense = async (req, res) => {
  try {
    const {
      description, amount, category, date, paymentMethod, notes, attachments, isRecurring, recurrencePeriod, recurrenceEndDate
    } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        description, amount, category, date, paymentMethod, notes, attachments, isRecurring, recurrencePeriod, recurrenceEndDate
      },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete an Expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }
    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};