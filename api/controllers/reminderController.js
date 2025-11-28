const { validationResult } = require('express-validator');
const { DateTime } = require('luxon');
const Reminder = require('../models/reminder');

const startOfUTCDay = (d = new Date()) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

// Helpers
function timeMatchesNow(reminder) {
  const now = DateTime.now().setZone(reminder.timezone || 'UTC');
  const dow = now.weekday % 7; // map 1..7 -> 1..6,0(sun)
  const allowed = (reminder.daysOfWeek || [0,1,2,3,4,5,6]).includes(dow);
  const hhmm = now.toFormat('HH:mm');
  return allowed && hhmm === reminder.timeOfDay && reminder.isActive;
}

async function processDueNotifications() {
  const active = await Reminder.find({ isActive: true });
  const now = new Date();
  const due = [];
  for (const r of active) {
    if (timeMatchesNow(r)) {
      // prevent duplicates within the same minute
      const last = r.lastNotifiedAt ? DateTime.fromJSDate(r.lastNotifiedAt).toFormat('yyyy-LL-dd HH:mm') : null;
      const curr = DateTime.fromJSDate(now).toFormat('yyyy-LL-dd HH:mm');
      if (last !== curr) {
        r.lastNotifiedAt = now;
        await r.save();
        // placeholder notification
        // eslint-disable-next-line no-console
        console.log(`Reminder due: ${r.title} @ ${r.timeOfDay} (${r.timezone})`);
        due.push(r);
      }
    }
  }
  return due;
}

// Routes handlers
const getReminders = async (req, res, next) => {
  try {
    const items = await Reminder.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (e) { next(e); }
};

const createReminder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const { title, type, timeOfDay, timezone, daysOfWeek } = req.body;
    const doc = await Reminder.create({ title, type, timeOfDay, timezone, daysOfWeek });
    res.status(201).json(doc);
  } catch (e) { next(e); }
};

const updateReminder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    const update = req.body;
    const doc = await Reminder.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) { next(e); }
};

const deleteReminder = async (req, res, next) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) { next(e); }
};

const toggleActive = async (req, res, next) => {
  try {
    const doc = await Reminder.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    doc.isActive = !doc.isActive;
    await doc.save();
    res.json(doc);
  } catch (e) { next(e); }
};

const markCompleteToday = async (req, res, next) => {
  try {
    const doc = await Reminder.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    const today = startOfUTCDay();
    if (!doc.completedDates.some(d => new Date(d).getTime() === today.getTime())) {
      doc.completedDates.push(today);
    }
    await doc.save();
    res.json(doc);
  } catch (e) { next(e); }
};

const analytics = async (req, res, next) => {
  try {
    const items = await Reminder.find().lean();
    const today = startOfUTCDay();
    const totals = items.length;
    const completedToday = items.filter(r =>
      (r.completedDates || []).some(d => new Date(d).getTime() === today.getTime())
    ).length;
    const completionRate = totals ? Math.round((completedToday / totals) * 100) : 0;
    res.json({ totals, completedToday, completionRate });
  } catch (e) { next(e); }
};

const runDueNotifications = async (req, res, next) => {
  try {
    const due = await processDueNotifications();
    res.json({ processed: due.length });
  } catch (e) { next(e); }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  toggleActive,
  markCompleteToday,
  analytics,
  runDueNotifications,
  processDueNotifications,
};