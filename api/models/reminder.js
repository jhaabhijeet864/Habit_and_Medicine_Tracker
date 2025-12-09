const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a reminder title'],
    trim: true
  },
  type: {
    type: String,
    enum: ['habit', 'medicine', 'general'],
    default: 'general'
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type',
  },
  time: {
    type: String, // HH:mm
    required: [true, 'Please provide a reminder time']
  },
  days: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  channel: {
    type: String,
    enum: ['in-app', 'email'],
    default: 'in-app'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
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

reminderSchema.index({ user: 1, isActive: 1 });

reminderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Reminder', reminderSchema);

