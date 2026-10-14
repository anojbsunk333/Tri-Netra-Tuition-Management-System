# Project

Scaffolded frontend and backend structure for the TRI·NETRA project.

- Backend: see `backend/`
- Frontend: see `frontend/`

Run servers:

Backend:

```bash
cd backend
npm install
copy .env.example .env
# Set a local JWT_SECRET in .env; generate one with:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
npm run seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Local demo logins

The mock users and passwords below are dummy credentials for local development
only. The backend seed command creates these users only when the local database
does not already contain users; it does not overwrite an existing database.
After starting both servers, sign in with:

| Role | Email | Dummy password |
| --- | --- | --- |
| Admin | `admin@trinetra.edu.np` | `local-demo-admin-only` |
| Teacher | `ramesh@trinetra.edu.np` | `local-demo-teacher-only` |
| Student | `sita@trinetra.edu.np` | `local-demo-student-only` |

Set local backend values in the untracked `backend/.env` file. Generate a
unique JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Put the generated value in `backend/.env`. Never use the demo passwords or a
committed example value for a deployed account. The seed script hashes the
local demo passwords with the backend's existing `hashPassword` helper before
storing them.
