# Step 6: Connect the Dashboard to the API

## Goal
The dashboard now gets its data from MongoDB (through the backend API) instead of fake data in the browser.

## Files
**New:** `dashboard/src/services/api.js`, `hooks/useApi.js`, `components/dashboard/DataState.jsx`
**Changed:** `context/TradingContext.jsx`, `hooks/usePortfolio.js`, `pages/Overview.jsx`, `Holdings.jsx`, `Positions.jsx`, `Watchlist.jsx`, `Orders.jsx`, `Insights.jsx`, `components/dashboard/OrderModal.jsx`, `components/layout/DashboardLayout.jsx`

## How it works (simple words)
- **api.js** is the only file that calls the backend. Every page uses its small functions (`getHoldings`, `placeOrder`, ...). If the backend address changes, only this file changes.
- **useApi** loads data when a page opens and gives `{ data, loading, error, refetch }`. Pages show a skeleton while loading and an error box with a Retry button if it fails.
- **TradingContext** loads the stock list from the database. Prices still move a tiny random amount every 2 seconds. Real live prices come in Step 8.
- **usePortfolio** takes holdings and positions from the database and calculates profit and loss from the live prices, so numbers keep moving.
- **Watchlist** saves to the database first, then updates the screen. Refresh the page and your changes stay.
- **Order window** sends the order to the server. If the server rejects it, its message is shown. The order is saved as OPEN. Step 9 executes it.
- The 30-day chart on Overview still uses sample history, because the API has no history yet.

## Problems faced and fixes
- When the backend is off, the dev proxy returns an empty 500. Fix: the API helper turns that into "Cannot reach the server. Is the backend running?".
- Hooks cannot run after an early `return`. Fix: every page calls all its hooks first, then checks loading and error.
- `useApi` needs a function that never changes, or it reloads forever. Fix: pass the exported API functions, not new inline ones.

## Interview questions
1. Why put all `fetch` calls in one `services` file?
2. What are loading, error and empty states? Why do real apps need all three?
3. Why must all hooks be called before an early return?
4. Why save to the server first and then update the screen? What is an optimistic update?
5. What does the Vite proxy do, and why does it avoid CORS problems in development?
