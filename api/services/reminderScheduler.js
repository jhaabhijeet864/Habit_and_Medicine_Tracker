const cron = require('node-cron');
const Reminder = require('../models/reminder');

function getLocalTimeParts(timezone) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone || 'UTC',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long'
  });
  const parts = formatter.formatToParts(new Date());
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return { time: `${map.hour}:${map.minute}`, weekday: map.weekday };
}

async function checkReminders() {
  const now = new Date();
  const activeReminders = await Reminder.find({ isActive: true });

  for (const reminder of activeReminders) {
    // skip snoozed reminders
    if (reminder.snoozedUntil && reminder.snoozedUntil > now) continue;

    const { time, weekday } = getLocalTimeParts(reminder.timezone);
    const matchesDay = !reminder.days || reminder.days.includes(weekday);
    const matchesTime = reminder.time === time;

    if (matchesDay && matchesTime) {
      // In a real app, trigger notification delivery here (email/push/etc.)
      console.log(`[reminder] Triggering reminder ${reminder._id} for user ${reminder.user} @ ${time} ${weekday}`);
    }
  }
}

function startReminderScheduler() {
  // Run every minute
  cron.schedule('* * * * *', () => {
    checkReminders().catch(err => console.error('Reminder scheduler error:', err));
  });
  console.log('Reminder scheduler started (every minute).');
}

module.exports = { startReminderScheduler };

