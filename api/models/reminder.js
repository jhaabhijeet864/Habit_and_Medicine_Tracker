const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['habit', 'medicine'], default: 'habit' },
    time: { type: String, required: true }, // HH:mm (24h) for daily reminders
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', ReminderSchema);