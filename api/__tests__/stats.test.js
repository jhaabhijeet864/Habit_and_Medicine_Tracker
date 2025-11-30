const request = require('supertest');
const mongoose = require('mongoose');
process.env.SKIP_BOOTSTRAP = '1';
const app = require('../index');
const Reminder = require('../models/reminder');

function utcDay(y,m,d){return new Date(Date.UTC(y,m,d));}

jest.setTimeout(15000);

let connected = false;

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/habit_test', {
      serverSelectionTimeoutMS: 3000,
    });
    connected = true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Mongo not available for stats test, skipping:', e.message);
  }
});

afterAll(async () => {
  if (connected) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

describe('Reminder stats endpoint', () => {
  beforeEach(async () => {
    if (!connected) return;
    await Reminder.deleteMany({});
    const today = new Date();
    const todayUTC = utcDay(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const yesterdayUTC = new Date(todayUTC.getTime() - 86400000);
    await Reminder.create({ title: 'Vitamin C', timeOfDay: '08:00', completedDates: [yesterdayUTC, todayUTC] });
    await Reminder.create({ title: 'Evening Walk', timeOfDay: '19:00', completedDates: [] });
  });

  it('returns stats with streaks and completion windows', async () => {
    if (!connected) {
      console.warn('Skipping stats test due to missing Mongo connection');
      return; // test passes implicitly
    }
    const res = await request(app).get('/api/reminders/stats');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.stats)).toBe(true);
    const vit = res.body.stats.find(s => s.title === 'Vitamin C');
    expect(vit.streak).toBeGreaterThanOrEqual(2);
  });
});
