# Step 1: Project Setup

## Goal
Create the project skeleton: three apps in one repository (a "monorepo") that all run.

## What was created
- `frontend/`: React + Vite + Tailwind + React Router (public website, port 5173)
- `dashboard/`: same stack (logged-in trading screen, port 5174)
- `backend/`: Node.js + Express + Mongoose + dotenv + cors (API, port 5000)
- `docs/`: documentation for every step
- Root files: `README.md`, `.gitignore`, `package.json` (one command runs all apps)
- `backend/.env.example`: shows which secrets are needed, without the real values

## Why separate folders?
- The public site and the trading screen have different jobs, so they are separate apps.
- The backend is its own server, so any app can call it.
- Real companies split code like this, and it is easy to explain in interviews.

## Commands
```bash
npm run install:all     # install all dependencies once
npm run dev             # run all three apps
cd backend && npm run dev   # run only the API
```
- Frontend: http://localhost:5173
- Dashboard: http://localhost:5174
- API health check: http://localhost:5000/api/health

## How apps talk to each other
Both Vite apps forward any request starting with `/api` to `localhost:5000` (see `vite.config.js`), so no CORS setup is needed while developing.

## Problems faced and fixes
- PowerShell does not support `&&` in older versions. Fix: use `;` or run commands one by one.
- The sandbox blocked the npm registry. Fix: ran `npm install` with network access allowed.

## Interview questions
1. What is a monorepo? What are its pros and cons?
2. Why split frontend, dashboard and backend?
3. What is a `.env` file and why is it not committed?
4. What is CORS and why does the Vite proxy avoid it in development?
5. What does `package.json` do?
