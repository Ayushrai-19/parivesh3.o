# PARIVESH 3.0 Monorepo

Full-stack Role-Based Environmental Clearance workflow system.

Stack:
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT (8h expiry) + bcrypt hashing

## Monorepo Structure

```text
.
|-- client/
|-- server/
|   |-- sql/
|   |   |-- schema.sql
|   |   \-- seed.js
|   \-- uploads/
|-- .env.example
|-- package.json
\-- README.md
```

## Setup

1. Create PostgreSQL DB:
```sql
CREATE DATABASE parivesh3;
```

2. Copy env template:
```bash
cp .env.example .env
```

3. Update `.env` values (especially `DATABASE_URL` and `JWT_SECRET`).

### Email Setup (Gmail Recommended)

To send real emails for registration and workflow notifications with Gmail, configure:

```env
EMAIL_ENABLED=true
EMAIL_PROVIDER=gmail
EMAIL_FROM=your_gmail@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_TLS_SERVERNAME=smtp.gmail.com
SMTP_FALLBACK_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
```

Optional (for DNS timeout issues on some networks):
- Set `SMTP_FALLBACK_HOST` to a reachable SMTP IP address.
- Keep `SMTP_TLS_SERVERNAME=smtp.gmail.com` for TLS validation.

Gmail account steps:
1. Turn on 2-Step Verification in your Google account.
2. Create an App Password: Google Account -> Security -> App Passwords.
3. Use that 16-character app password as `SMTP_PASS`.

You can also set `EMAIL_PROVIDER=outlook` for Outlook defaults, or `EMAIL_PROVIDER=custom` with manual SMTP host/port.

If SMTP credentials are missing or `EMAIL_ENABLED=false`, the app will continue to work but emails will be skipped.

### Admin Face Login Setup

Admin login now requires password + live face verification with a threshold above 80%.

Default integration points to:
- `Face module/face_recognition/examples/admin_auth_portal.py`
- `Face module/face_recognition/examples/admin_auth/admin_auth.db`
- `Face module/face_recognition/.venv311/Scripts/python.exe` (if present)

Optional env overrides:

```env
FACE_AUTH_PYTHON=C:/path/to/python.exe
FACE_AUTH_SCRIPT_PATH=C:/path/to/admin_auth_portal.py
FACE_AUTH_DB_PATH=C:/path/to/admin_auth.db
ADMIN_FACE_MIN_CONFIDENCE=0.8
```

Before admin login can work, ensure the face DB has enrolled embeddings for the same admin login ID (for example `Admin1`).

### Quick Start Without PostgreSQL (Current)

If you want to run immediately without Postgres:
- Keep `USE_INMEMORY_DB=true` in `.env`
- Start the server directly (no DB needed)

Convenience scripts:
- `npm run dev:memory`
- `npm run start:memory`

Both memory scripts auto-clear port `5000` listeners to prevent `EADDRINUSE` crashes.

This uses server-side in-memory data (`pg-mem`) so register/login and workflows work.
Note: data resets when server restarts.

4. Install dependencies:
```bash
npm run install:all
```

5. Seed database:
```bash
npm run seed
```

Skip this step when `USE_INMEMORY_DB=true`.

6. Start both apps:
```bash
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Seeded Accounts

- Admin: `admin@parivesh.gov.in` / `Admin@123`
- Scrutiny 1: `scrutiny1@parivesh.gov.in` / `Scrutiny@123`
- Scrutiny 2: `scrutiny2@parivesh.gov.in` / `Scrutiny@123`
- MoM 1: `mom1@parivesh.gov.in` / `Mom@123`
- MoM 2: `mom2@parivesh.gov.in` / `Mom@123`
- Proponent 1: `proponent1@example.com` / `Proponent@123`
- Proponent 2: `proponent2@example.com` / `Proponent@123`
- Proponent 3: `proponent3@example.com` / `Proponent@123`

## Key Functional Coverage

- Single login page with role-based dashboard routing.
- Proponent self-registration.
- Admin-only creation of SCRUTINY/MOM users.
- Strict state machine enforced at API and DB trigger levels.
- Automatic gist generation on `REFERRED -> MOM_GENERATED` using template placeholders:
  - `{{project_name}}`, `{{sector}}`, `{{location}}`, `{{description}}`, `{{proponent_name}}`
- MoM lock immutability with `423 Locked` rejection after finalization.
- Protected document upload/download with `.doc/.docx` validation on frontend + backend.
- Notifications polling every 30 seconds via `GET /api/v1/notifications`.
- Email notifications for key events:
  - Proponent registration
  - Application submit/resubmit
  - EDS raise / finalization notifications
  - Payment success/failure notifications
  - Admin-created SCRUTINY/MOM user accounts
- Export of finalized MoM to DOCX and PDF.

## API Base

All routes are under:
`/api/v1`

Groups:
- `/auth`
- `/admin`
- `/applications`
- `/documents`
- `/scrutiny`
- `/mom`
- `/notifications`
- `/export`

Admin monitoring additions:
- `GET /api/v1/admin/payments` (filters: `status`, `method`, `search`, with summary + pagination)

Temporary auth helper in memory mode:
- `POST /api/v1/auth/quick-login` with body `{ "role": "ADMIN|PROPONENT|SCRUTINY|MOM" }`

Response shape:
```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

## Notes

- Payment is intentionally excluded. A placeholder exists in the proponent application flow:
  `TODO: PAYMENT INTEGRATION`.
- Uploaded files are stored in `server/uploads/{applicationId}`.
- File system paths are not exposed in API responses.
