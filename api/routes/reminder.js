const express = require('express');
const router = express.Router();
const { getReminders, createReminder, updateReminder } = require('../controllers/reminderController');

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
// Add delete route later if needed

module.exports = router;