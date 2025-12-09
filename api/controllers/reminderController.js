const Reminder = require('../models/reminder');

// @desc    Get all reminders for user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const filter = { user: req.user.id };
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const reminders = await Reminder.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reminders.length, data: reminders });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res, next) => {
  try {
    let reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });
    if (reminder.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this reminder' });
    }

    reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ success: false, message: 'Reminder not found' });
    if (reminder.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this reminder' });
    }
    await reminder.deleteOne();
    res.status(200).json({ success: true, message: 'Reminder deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReminders, createReminder, updateReminder, deleteReminder };