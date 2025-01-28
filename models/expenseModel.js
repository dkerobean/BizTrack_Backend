const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxLength: [100, 'Description cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['marketing', 'supplies', 'utilities', 'rent', 'salary', 'maintenance', 'other']
  },
  date: {
    type: Date,
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'other'],
    default: 'cash'
  },
  notes: {
    type: String,
    trim: true,
    maxLength: [500, 'Notes cannot exceed 500 characters']
  },
  attachments: [{
    type: String
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePeriod: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: null
  },
  recurrenceEndDate: {
    type: Date
  }
}, {
  timestamps: true
});

expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ category: 1, userId: 1 });

module.exports = mongoose.model('Expense', expenseSchema);