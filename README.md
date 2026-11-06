# JARI

JARI is a poultry-farm intelligence and finance platform. It helps farmers organise farm, flock, health, production and financial records so that farm operations are easier to understand and appropriate support can be explored. The product is designed around poultry farmers in Jos South, Plateau State, Nigeria.

The repository contains a Next.js frontend and a FastAPI backend. The frontend currently includes browser-local simulated workflows; the presence of a backend API client does not mean every screen is connected to the live API yet.

## Project structure

```text
frontend/   Next.js 14 application (TypeScript, React, Tailwind CSS)
backend/    FastAPI application, PostgreSQL models and Alembic migrations
deploy/     Deployment-related configuration and assets
scripts/    Project maintenance and deployment scripts
```

## Requirements

- Node.js 18.17 or newer and npm
- Python 3.12 (the backend Dockerfile uses Python 3.12)
- PostgreSQL 16, either installed locally or run with Docker
- Git

Docker is optional for frontend-only work. It is the easiest way to run PostgreSQL locally and is used by the provided backend Compose configuration.

## Frontend setup

Open a terminal at the repository root, then:

```powershell
cd frontend
npm ci
Copy-Item .env.example .env.local
npm run dev
```

The frontend is available at [http://localhost:3000](http://localhost:3000). The local environment template points the API client at the local backend (`http://localhost:8000/api/v1`). You can edit `.env.local` if your backend uses a different address. Restart the Next.js dev server after changing environment variables.

The main demo workflows currently use simulated records in browser `localStorage`. They can run without a local backend; backend API wiring is not yet complete across all screens. Demo records stay in that browser and do not represent production data.

Useful frontend commands (run from `frontend/`):

```powershell
npm run dev              # Start the development server
npm run build            # Create a production build
npm run start            # Serve the production build
npm run test:workflows   # Run simulated-data workflow tests
npx tsc --noEmit         # Type-check the frontend
npm run lint             # Next.js lint command; requires ESLint setup
```

The repository currently has no ESLint configuration, so the lint command may open Next.js's first-time configuration prompt.

## Backend setup

### 1. Start PostgreSQL

If PostgreSQL 16 is already available locally, create a database and user matching your `DATABASE_URL`. Otherwise, from any terminal with Docker installed, start a local development database:

```powershell
docker run --name jari-postgres `
  -e POSTGRES_DB=jari_db `
  -e POSTGRES_USER=jari_user `
  -e POSTGRES_PASSWORD=jari_dev_password `
  -p 5432:5432 `
  -d postgres:16-alpine
```

If the container already exists, use `docker start jari-postgres` instead. The development database URL in `backend/.env.example` expects this database on `localhost:5432`.

### 2. Create the Python environment and install dependencies

In a second terminal at the repository root:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

If PowerShell blocks activation, allow it for the current terminal only with `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then activate the environment again. On macOS/Linux, create and activate the environment with `python3.12 -m venv .venv` and `source .venv/bin/activate`.

Review `backend/.env` before starting the API. For local development, set at least:

```dotenv
ENVIRONMENT=development
DEBUG=true
DATABASE_URL=postgresql+psycopg://jari_user:jari_dev_password@localhost:5432/jari_db
SECRET_KEY=replace_with_a_local_random_secret_of_at_least_32_characters
API_V1_STR=/api/v1
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

Do not commit `.env` files or use these development values in production. If a database password contains URL-reserved characters, URL-encode it in `DATABASE_URL`.

### 3. Create/update the database schema

With the virtual environment active, PostgreSQL running, and the terminal in `backend/`:

```powershell
alembic upgrade head
```

Alembic migrations are in `backend/alembic/versions/`. The backend container entrypoint also runs `alembic upgrade head` at startup.

### 4. Start the API

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Useful local endpoints:

- API status: [http://localhost:8000/health](http://localhost:8000/health)
- API root: [http://localhost:8000/](http://localhost:8000/)
- Interactive OpenAPI documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- OpenAPI JSON: [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

The API router includes authentication, farms, poultry houses, flocks, feed, production, health, financial records, KYC, documents, administration, and institution endpoints.

### Optional: seed a JARI administrator

With the backend environment active and migrations applied, create an administrator with a password you choose:

```powershell
python -m app.scripts.seed_admin --phone 08030000000 --name "JARI Administrator" --password "use-a-private-password"
```

Choose a unique phone number and a strong private password. Do not put real credentials in source control, shared documentation, or a public demo credential selector.

### Backend tests

Run from `backend/` with the virtual environment active:

```powershell
pytest
```

Tests that access the database require a working test database/configuration; do not point destructive tests at production data.

## Running the full local stack

Run PostgreSQL first, then start the backend and frontend in separate terminals. Set `BACKEND_CORS_ORIGINS` in `backend/.env` to include the frontend origin, and set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to the backend API base URL.

```text
Browser  http://localhost:3000
Frontend http://localhost:3000
Backend  http://localhost:8000
API base http://localhost:8000/api/v1
Database localhost:5432
```

The frontend has simulated services and API helpers, but its current dashboard/auth workflows still use local demo data. A local API URL alone does not switch all frontend pages to PostgreSQL-backed behavior.

## Backend Docker Compose deployment

`backend/docker-compose.prod.yml` is configured for a production-style deployment: it starts PostgreSQL and the API, runs migrations from the API container entrypoint, and keeps database and uploads in named Docker volumes. It binds the API to `127.0.0.1:8000` on the host.

1. Copy `backend/.env.production.example` to `backend/.env.production`.
2. Replace every example/placeholder with private production values. Use a strong database password and secret key; ensure the `DATABASE_URL` uses the Compose database host `db` and the same password. URL-encode special characters in the database URL.
3. Set `BACKEND_CORS_ORIGINS` to the exact deployed frontend origin(s).
4. From `backend/`, start the stack:

```powershell
docker compose --env-file .env.production -f docker-compose.prod.yml up --build -d
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f api
```

Stop the services while preserving their data volumes with:

```powershell
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

Keep production `.env` files, database credentials, token secrets, and uploaded documents private. Do not use `docker compose down -v` unless you intentionally want to delete the database and upload volumes.

## Demo data and privacy notes

- Frontend demo accounts and records are browser-local simulated data, not production users or farm records.
- The institution risk-profile directory contains clearly labeled fictional sample farms for demonstration. It does not expose live farmer data or provide an underwriting decision.
- Actual farmer records must remain subject to farmer consent. JARI summaries are informational and do not guarantee a loan, insurance cover, claim, or grant.
- The public login page intentionally does not display internal JARI administrator credentials. Create real backend administrators with the seeding command above and keep their credentials private.

## Project documentation

- `frontend-remaining-work.md` — current frontend implementation and handoff tracker
- `JARI Institution Onboarding and Institutional Dashboard Implementation.md` — institution product requirements
- `frontend-documentation.md` and `Frontend Development.md` — frontend/product notes
- `backend/` — FastAPI configuration, API routes, models, migrations, and tests
