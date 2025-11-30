const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// Core middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
if (process.env.REQUEST_LOGGING === '1') {
	app.use(morgan('combined'));
}

// Rate limit only mutating routes
const writeLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
});

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Routes
app.use('/api/reminders', require('./routes/reminder'));

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
	console.error(err);
	res.status(500).json({ message: 'Server error' });
});

async function bootstrap() {
	const uri = process.env.MONGO_URI;
	if (!uri) throw new Error('MONGO_URI not set');
	await connectDB(uri);

	// Start local cron only when opted-in
	if (process.env.ENABLE_LOCAL_CRON === '1') {
		try {
			const { startScheduler } = require('./jobs/scheduler');
			startScheduler();
			console.log('Local scheduler started');
		} catch (e) {
			console.log('Scheduler not started:', e.message);
		}
	}
}

if (process.env.SKIP_BOOTSTRAP !== '1') {
	bootstrap().then(() => {
		if (require.main === module) {
			const port = process.env.PORT || 4000;
			app.listen(port, () => console.log(`API listening on :${port}`));
		}
	});
}

module.exports = app;