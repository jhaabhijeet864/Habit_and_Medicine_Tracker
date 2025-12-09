// @desc    Get all reminders
const getReminders = (req, res) => {
  res.status(200).json({ message: 'Success! Fetched all reminders.' });
};

// @desc    Create a new reminder
const createReminder = (req, res) => {
  res.status(201).json({ message: 'Success! Created a new reminder.' });
};

// @desc    Update an existing reminder
const updateReminder = (req, res) => {
  res.status(200).json({ message: `Success! Updated reminder ${req.params.id}.` });
};

// Add delete functions here...

module.exports = { getReminders, createReminder, updateReminder };