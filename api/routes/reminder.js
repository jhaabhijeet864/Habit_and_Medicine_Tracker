const express = require('express');
const router = express.Router();
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  snoozeReminder
} = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

// All reminder routes are protected
router.use(protect);

router.route('/')
  .get(getReminders)
  .post(createReminder);

router.route('/:id')
  .put(updateReminder)
  .delete(deleteReminder);

router.put('/:id/snooze', snoozeReminder);

module.exports = router;