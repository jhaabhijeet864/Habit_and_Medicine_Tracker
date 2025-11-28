# DAILY HABIT & MEDICINE TRACKER WITH PROGRESS ANALYTICS

## 1. Title Page
Mini Project Report: Daily Habit & Medicine Tracker with Progress Analytics
Course: Internship / Mini Project – BCC 351 (III Semester)
Academic Session: 2025–26 (Odd)
Institution: Dronacharya Group of Institutions (Affiliated to Dr. A P J Abdul Kalam Technical University, Lucknow)

Team Members:
- Abhinav Singh (University Roll: 2402301530004, College Roll: 19479)
- Aastha (University Roll: 2402301530002, College Roll: 19477)
- Abhijeet Jha (University Roll: 2402301530003, College Roll: 19478)

## 2. Abstract
People frequently miss taking medicines or performing beneficial habits due to busy routines. This project delivers a lightweight web application that stores time-based reminders and notifies users at the correct moment, while tracking completion history for future analytical features such as streaks and daily performance. The backend is built with Node.js, Express.js, MongoDB, and scheduled processing via serverless cron triggers (Vercel Cron). The design emphasizes modularity, scalability to richer notification channels, and data structures that support longitudinal progress metrics.

## 3. Problem Statement
Missed medication doses and inconsistent habit maintenance can negatively affect health outcomes and personal development. Existing solutions may be overly complex or lack transparent progress analytics. A minimal, extensible platform is needed to:
- Persist reminders reliably.
- Provide timely notifications.
- Record completion for historical analysis.
- Enable future expansion (streaks, charts, push notifications).

## 4. Objectives
- Maintain a list of medicine and habit reminders with precise daily trigger times.
- Persist data across sessions in MongoDB.
- Provide an endpoint-driven architecture suitable for web/mobile frontends.
- Log completion status to enable analytics (completion rate, streak detection).
- Prepare infrastructure for scheduled checks without relying on continuously running servers.

## 5. Scope
Current Release (MVP): CRUD for reminders, completion marking, analytics summary (total, completed today, completion rate), basic due-notification execution endpoint.
Near-Term Extensions: Streak computation, progress dashboard, push/web notifications, user accounts & authentication, rate limiting.
Long-Term Extensions: Multi-user tenancy, medication dosage tracking, missed dose follow-up, adaptive scheduling (smart suggestions), integration with wearable data.

## 6. System Requirements
### Hardware
- Minimum: Intel i3 (or equivalent), 4 GB RAM, 500 MB free disk.
- Recommended: SSD storage for faster local development.

### Software
- OS: Windows 10 / Linux / macOS.
- Runtime: Node.js (LTS ≥ 18.x).
- Database: MongoDB (Atlas or local).
- Tools: VS Code, Git, Browser (Chrome/Firefox), MongoDB Compass (optional).

### Environment Variables (.env)
- `MONGO_URI`: MongoDB connection string.
- `ENABLE_LOCAL_CRON=1`: (Optional) Enables local in-process node-cron scheduler.
- `PORT` (optional): Development server port.

## 7. Technology Stack
- Backend Framework: Express.js (Node.js)
- Database: MongoDB (Mongoose ODM)
- Scheduling: Vercel Cron (serverless endpoint trigger) + optional local node-cron
- Validation: express-validator
- Time/Timezone Handling: Luxon
- Security Middleware: Helmet, CORS configuration
- Testing: Jest + Supertest
- Deployment: Vercel Serverless Functions (`@vercel/node`)

## 8. Architecture Overview
Layered modular architecture:
- Entry (`api/index.js`): Initializes middleware, routes, error handling, exports Express app for serverless.
- Configuration (`api/config/db.js`): Reusable cached Mongo connection for serverless cold starts.
- Model (`api/models/reminder.js`): Reminder schema with analytics fields.
- Controller (`api/controllers/reminderController.js`): Business logic (CRUD, analytics, completion, notification processing).
- Routes (`api/routes/reminder.js`): Validation + REST endpoints + cron trigger endpoint.
- Scheduler (`api/jobs/scheduler.js`): Local development periodic checks.

Data Flow:
User Client → HTTP Request → Express Route → Controller → MongoDB (CRUD) → Response → (Cron hits endpoint for due checks) → Notification placeholder.

## 9. Flow Chart
High-level (as per initial design, textual representation):
Start → Add Reminder → Save to MongoDB → Display List → [Scheduled Check] → Time Match? → (Yes) Send Notification → User Marks Complete → Update Database → Loop.

## 10. Data Model
Reminder Document Fields:
- `title: String` – Required, trimmed.
- `type: Enum('medicine','habit')` – Categorization.
- `timeOfDay: String` – 24h format "HH:mm" local user time reference.
- `timezone: String` – IANA timezone, default Asia/Kolkata.
- `daysOfWeek: [Number]` – Allowed trigger days (0=Sun..6=Sat).
- `isActive: Boolean` – Soft enable/disable.
- `completedDates: [Date]` – UTC midnight dates when user marked completion.
- `lastNotifiedAt: Date` – De-duplication of notifications within a minute.
- `timestamps: createdAt/updatedAt`.

Indexes:
- `{ isActive: 1 }` for filtering active reminders quickly.
- `{ timeOfDay: 1, timezone: 1 }` for potential scheduled batching.

Streak Logic (future): Iterate backward from today’s UTC midnight; count consecutive presence in `completedDates` until a gap.

## 11. API Design
Base URL (local): `http://localhost:4000/api`
Base URL (Vercel): `https://<deployment>/api`

Endpoints (Reminders):
- `GET /health` → `{ ok: true }` health check.
- `GET /reminders` → List all reminders.
- `POST /reminders` → Create reminder (validation: title, timeOfDay).
- `PUT /reminders/:id` → Update editable fields.
- `PATCH /reminders/:id/toggle` → Flip `isActive`.
- `PATCH /reminders/:id/complete` → Append today’s UTC date if not already present.
- `GET /reminders/analytics` → `{ totals, completedToday, completionRate }`.
- `GET /reminders/cron/due` → Process due notifications (invoked by Vercel Cron or manual local call).

### Validation Rules
- `title`: non-empty string.
- `timeOfDay`: regex `^([01]\d|2[0-3]):[0-5]\d$`.
- `daysOfWeek`: array of integers 0–6.
- `id`: valid Mongo ObjectId for param routes.

### Completion Rate Formula
$completionRate = \frac{completedToday}{totalReminders} \times 100$

## 12. Scheduling Strategy
Local Development:
- Optional `node-cron` runs every minute, calls internal logic to check due reminders.
Serverless Production:
- Vercel Cron invokes `GET /api/reminders/cron/due` each minute (UTC). Express endpoint runs same logic.
- Ensures notification logic executes without relying on persistent process.
- De-duplication via comparing formatted minute timestamp against `lastNotifiedAt`.

## 13. Notification Strategy (Current & Future)
Current: Console logging placeholder when a reminder becomes due.
Planned: Web Push (Service Worker + VAPID), Email (SendGrid), SMS (Twilio). Store delivery status and attach metadata to each reminder occurrence.

## 14. Validation & Error Handling
- express-validator ensures request body integrity; returns 422 with error array.
- Central error middleware logs server-side exceptions and responds with generic 500 JSON.
- Future: differentiate 4xx vs 5xx, structured error codes for frontend mapping.

## 15. Security Considerations
- Helmet sets secure headers.
- CORS currently permissive; restrict origins for production.
- Input validation prevents malformed data.
- Future: Authentication (JWT/session), RBAC for multi-user, rate limiting (Express Rate Limit), logging & monitoring.

## 16. Deployment (Vercel)
- `vercel.json` config: build `api/index.js`, route all requests, define per-minute cron.
- MongoDB Atlas recommended for global access & uptime.
- Environment vars managed via Vercel dashboard.

## 17. Testing Strategy
Current:
- Jest + Supertest health endpoint test.
Next Tests:
- Reminder creation & validation failure cases.
- Completion marking logic.
- Analytics accuracy with seeded data.
- Cron endpoint idempotency (no duplicate notifications within same minute).

Sample Command:
```bash
npm test
```

## 18. Linting & Code Quality
- ESLint (recommended rules) with custom allowances (`no-console` off, ignore underscore args for unused vars).
- Continuous Integration plan: run `npm run lint && npm test` per pull request.

## 19. Gantt Chart (Planned Timeline)
| Task                  | Week 1 | Week 2 | Week 3 | Week 4 | Week 5 | Week 6 |
|-----------------------|--------|--------|--------|--------|--------|--------|
| Requirement Analysis  |  ████  |        |        |        |        |        |
| Basic Features (CRUD) |        |  ████  |        |        |        |        |
| Intermediate (Analytics)|      |        |  ████  |        |        |        |
| Advanced (Notifications)|      |        |        |  ████  |        |        |
| Testing & Optimization|        |        |        |        |  ████  |        |
| Documentation & Wrap  |        |        |        |        |        |  ████  |

(Each ████ represents focused effort phase.)

## 20. Future Work
- Full user auth + multi-user isolation.
- Frontend (React/Vue) dashboard with charts (streaks, monthly adherence).
- Push notification infrastructure & user preference settings.
- Aggregated medication adherence scoring algorithm.
- Accessibility enhancements (ARIA, high-contrast UI modes).
- Internationalization (i18n) for time zone & language.

## 21. Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Serverless cold starts | Slight latency on first request | Cached Mongo connection reuse |
| Cron missed invocation | Delayed notifications | Observability & monitoring, fallback manual trigger |
| Time zone confusion | Incorrect trigger times | Use Luxon & store canonical timezone per reminder |
| Notification duplication | User annoyance | `lastNotifiedAt` comparison per minute |
| Data growth (completedDates) | Larger document size | Archive old dates or separate history collection |

## 22. Performance Considerations
- Minute cron scans active reminders; optimize by querying only active docs and indexing on `isActive`.
- Potential batching: Pre-compute upcoming reminders into a queue collection.
- Horizontal scaling: Separate notification processing into dedicated worker service.

## 23. Maintenance Strategy
- Semantic versioning for API changes.
- Automated tests for regression detection.
- Git branching model: `main` (stable), `feature/*`, pull requests with lint/test gates.
- Documentation updates synchronized with schema changes.

## 24. References
1. GeeksforGeeks – Web Development Tutorials – https://www.geeksforgeeks.org/web-development
2. Hitesh Choudhary – Full Stack Web Development (YouTube)
3. Ethan Brown – *Web Development with Node and Express*, O’Reilly, 2nd Ed.
4. MongoDB Documentation – https://www.mongodb.com/docs
5. MDN Web Docs – https://developer.mozilla.org

## 25. Conclusion
The project establishes a solid backend foundation for a habit and medication tracking system, emphasizing extensibility and analytic readiness. With modular architecture, validated endpoints, and serverless-compatible scheduling, the system can evolve into a fully featured health adherence platform.

## 26. Quick Start Summary
```bash
# Install
npm install

# Run (dev)
MONGO_URI="<your mongodb uri>" ENABLE_LOCAL_CRON=1 npm run dev

# Test
npm test

# Lint
npm run lint
```

## 27. Glossary
- **UTC Midnight Date**: Date object normalized to 00:00:00 UTC for daily completion tracking.
- **Reminder Due**: When current local time (in reminder timezone) matches `timeOfDay` & allowed day.
- **Completion Rate**: Percentage of reminders completed today relative to total reminders.
- **Streak**: Consecutive days with completion recorded.

---
End of Report.
