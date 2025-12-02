const express = require('express');
const router = express.Router();
const {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabitCompletion,
  getHabitStats
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');
const mongoose = require('mongoose');
const habitSchema = require('../models/habitModel');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.route('/:id')
  .get(getHabit)
  .put(updateHabit)
  .delete(deleteHabit);

router.post('/:id/log', logHabitCompletion);
router.get('/:id/stats', getHabitStats);

module.exports = mongoose.model('Habit', habitSchema);

module.exports = router;