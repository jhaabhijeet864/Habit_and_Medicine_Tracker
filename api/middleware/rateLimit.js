const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10); // 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '120', 10); // per IP per window

const buckets = new Map();

function cleanup() {
  const now = Date.now();
  for (const [ip, entry] of buckets.entries()) {
    if (now - entry.start > WINDOW_MS) buckets.delete(ip);
  }
}

// Basic in-memory rate limiter (sufficient for single-instance dev)
function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const entry = buckets.get(ip) || { count: 0, start: now };

  if (now - entry.start > WINDOW_MS) {
    entry.count = 0;
    entry.start = now;
  }

  entry.count += 1;
  buckets.set(ip, entry);
  cleanup();

  if (entry.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please slow down.'
    });
  }

  next();
}

module.exports = { rateLimiter };

