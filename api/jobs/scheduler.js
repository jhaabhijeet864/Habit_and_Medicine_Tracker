const cron = require('node-cron');
const { processDueNotifications } = require('../controllers/reminderController');

function startScheduler() {
  cron.schedule('* * * * *', async () => {
    try {
      const due = await processDueNotifications();
      if (due.length) {
        console.log(`Processed ${due.length} due reminders`);
      }
    } catch (e) {
      console.error('Scheduler error:', e.message);
    }
  });
}

module.exports = { startScheduler };
