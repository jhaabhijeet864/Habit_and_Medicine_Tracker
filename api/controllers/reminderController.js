const Reminder = require('../models/reminder');

// @desc    Get all reminders
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ time: 1, createdAt: -1 });
    res.status(200).json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reminders', error: err.message });
  }
};

// @desc    Create a new reminder
const createReminder = async (req, res) => {
  try {
    const { name, type, time } = req.body;
    if (!name || !time) {
      return res.status(400).json({ message: 'name and time are required' });
    }
    const reminder = await Reminder.create({ name, type, time });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create reminder', error: err.message });
  }
};

// @desc    Update an existing reminder (name/type/time/completed)
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ['name', 'type', 'time', 'completed'];
    const update = Object.fromEntries(
      Object.entries(req.body).filter(([k]) => allowed.includes(k))
    );

    const reminder = await Reminder.findByIdAndUpdate(id, update, { new: true });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.status(200).json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update reminder', error: err.message });
  }
};

module.exports = { getReminders, createReminder, updateReminder };