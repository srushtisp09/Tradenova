# 📈 TradeNova

> Trade smarter. Learn faster. Risk nothing.

A full-stack paper trading platform: practice the stock market with virtual money, live-style charts, a watchlist, holdings, positions and orders.

**Status:** in progress (Steps 1 to 6 done: setup, design system, landing page, dashboard UI, API and database, dashboard connected to the API, plus Beginner and Pro tracks and a 3D explore page).

## Tech stack
- **Frontend and Dashboard:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Planned:** JWT auth, Chart.js, live market API, Jest tests, AWS deployment

## Folders
| Folder | What it is | Port |
|---|---|---|
| `frontend/` | Public website (landing page) | 5173 |
| `dashboard/` | Logged-in trading screen | 5174 |
| `backend/` | API and database | 5000 |
| `docs/` | Step-by-step documentation | - |

## Run it
```bash
npm run install:all   # installs everything (once)
npm run dev           # starts all three apps together
```
Or run each app alone: `cd frontend && npm run dev`.

Backend setup: copy `backend/.env.example` to `backend/.env` and add your `MONGO_URI`.

## Roadmap
- [x] Step 1: Project setup
- [x] Step 2: Design system
- [x] Step 3: Landing page
- [x] Step 4: Dashboard UI
- [x] Step 4b: Beginner academy and Pro insights tracks
- [x] Bonus: 3D explore page at `/explore/`
- [x] Step 5: Backend and MongoDB
- [x] Step 6: Connect frontend to backend
- [ ] Step 7: Authentication
- [ ] Step 8: Charts and live data
- [ ] Step 9: Buy/sell and orders
- [ ] Step 10: Testing
- [ ] Step 11: Deployment

## Docs
See the [`docs`](./docs) folder for what was built in each step, problems faced and interview questions.
