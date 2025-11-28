const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const C = require('../controllers/reminderController');

// Validators
const idParam = [param('id').isMongoId().withMessage('Invalid id')];
const baseBody = [
	body('title').isString().trim().isLength({ min: 1 }).withMessage('title required'),
	body('type').optional().isIn(['medicine', 'habit']).withMessage('type invalid'),
	body('timeOfDay').matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('timeOfDay HH:mm'),
	body('timezone').optional().isString(),
	body('daysOfWeek').optional().isArray().custom(arr => arr.every(n => Number.isInteger(n) && n>=0 && n<=6)),
];

// Routes
router.get('/', C.getReminders);
router.post('/', baseBody, C.createReminder);
router.get('/analytics', C.analytics);
router.patch('/:id/toggle', idParam, C.toggleActive);
router.patch('/:id/complete', idParam, C.markCompleteToday);
router.put('/:id', idParam, C.updateReminder);
router.delete('/:id', idParam, C.deleteReminder);

// Cron endpoint for Vercel
router.get('/cron/due', C.runDueNotifications);

module.exports = router;