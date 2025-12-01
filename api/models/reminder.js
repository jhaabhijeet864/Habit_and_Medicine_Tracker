const { Schema, model } = require('mongoose');

const ReminderSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['medicine', 'habit'], default: 'habit' },
    timeOfDay: { type: String, required: true },
    timezone: { type: String, default: 'Asia/Kolkata' },
    daysOfWeek: { type: [Number], default: [0,1,2,3,4,5,6] },
    isActive: { type: Boolean, default: true },

    completedDates: { type: [Date], default: [] },
    lastNotifiedAt: { type: Date },
  },
  { timestamps: true }
);

ReminderSchema.index({ isActive: 1 });
ReminderSchema.index({ timeOfDay: 1, timezone: 1 });

module.exports = model('Reminder', ReminderSchema);
