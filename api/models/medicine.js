const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please provide a medicine name'],
    trim: true
  },
  dosage: {
    amount: {
      type: Number,
      required: [true, 'Please provide dosage amount']
    },
    unit: {
      type: String,
      enum: ['mg', 'ml', 'tablet', 'capsule', 'drops', 'spray'],
      default: 'tablet'
    }
  },
  frequency: {
    type: String,
    enum: ['once', 'twice', 'thrice', 'four-times', 'as-needed'],
    default: 'once'
  },
  times: [{
    type: String, // e.g., "08:00", "14:00", "20:00"
    required: true
  }],
  instructions: {
    type: String,
    enum: ['before-meal', 'after-meal', 'with-meal', 'empty-stomach', 'anytime'],
    default: 'anytime'
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date'],
    default: Date.now
  },
  endDate: {
    type: Date
  },
  prescribedBy: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  sideEffects: [{
    type: String
  }],
  inventory: {
    current: {
      type: Number,
      default: 0
    },
    alertThreshold: {
      type: Number,
      default: 5
    }
  },
  logs: [{
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    taken: {
      type: Boolean,
      default: false
    },
    skipped: {
      type: Boolean,
      default: false
    },
    note: {
      type: String,
      default: ''
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
medicineSchema.index({ user: 1, isActive: 1 });
medicineSchema.index({ user: 1, startDate: -1 });

// Update timestamp on save
medicineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Medicine', medicineSchema);