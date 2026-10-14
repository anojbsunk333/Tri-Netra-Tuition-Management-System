# Project

Scaffolded frontend and backend structure for the TRI·NETRA project.

- Backend: see `backend/`
- Frontend: see `frontend/`

Run servers:

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Local demo logins

The mock users are for local development only. After starting the frontend, use:

| Role | Email | Dummy password |
| --- | --- | --- |
| Admin | `admin@trinetra.edu.np` | `local-demo-admin-only` |
| Teacher | `ramesh@trinetra.edu.np` | `local-demo-teacher-only` |
| Student | `sita@trinetra.edu.np` | `local-demo-student-only` |

For backend authentication, copy `backend/.env.example` to `backend/.env`, set
your local MongoDB URI and other configuration, then generate a unique JWT
secret with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Put the generated value in the untracked `backend/.env` file. Never use the
demo passwords or a committed example value for a deployed account. The seed
script hashes the local demo passwords when it creates users; it does not
replace existing users in the local database.
