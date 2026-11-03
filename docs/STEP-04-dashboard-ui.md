# Step 4: Dashboard UI (dashboard app)

## Goal
Build the logged-in trading screen: sidebar menu, Overview, Holdings, Positions, Watchlist, Orders page and a Buy/Sell order window. Works on desktop and phone.

## Files created (all inside `dashboard/src`)
- `data/mockData.js`: demo stocks, holdings, positions, 30-day history (replaced by real API data in Step 6)
- `context/TradingContext.jsx`: shared live prices (change every 2 s) and the order window state
- `hooks/usePortfolio.js`: all profit/loss maths in one place
- `components/layout/DashboardLayout.jsx`: sidebar (desktop), bottom bar (phone), top bar with NIFTY and SENSEX, and `<Outlet />`
- `components/layout/Icons.jsx`: menu icons
- `components/dashboard/`: `AreaChart`, `Sparkline`, `DataTable`, `LivePrice`, `StatCard`, `Change`, `OrderModal`
- `pages/`: `Overview`, `Holdings`, `Positions`, `Watchlist`, `Orders`
- `utils/format.js` (rupee formatting) and `utils/seeded.js` (repeatable random numbers)
- `App.jsx`: routes

## How it works (simple words)
- **Nested routes:** all pages sit inside one layout route. The layout draws the sidebar and top bar once, and `<Outlet />` shows the current page.
- **One menu list:** `navItems` feeds both the sidebar and the phone bottom bar.
- **Context:** `TradingContext` holds the live prices, so Overview, Holdings and Watchlist always show the same number. Any component can read it with `useTrading()`.
- **Simulated live prices:** a timer nudges every price by a tiny random amount every 2 seconds. `LivePrice` flashes green or red when the value changes.
- **P&L maths:** profit = (current price − average cost) × quantity. Day change = (current price − yesterday's close) × quantity. All done in `usePortfolio`.
- **DataTable:** one reusable table for Holdings and Positions. Click a heading to sort (up, down, off). It scrolls sideways on phones.
- **AreaChart:** SVG path from numbers. Mouse or touch position is turned into the nearest data index to show that day's value.
- **Watchlist:** a React state array. Add pushes a symbol, remove filters it out, search filters what is shown.
- **Order window:** a controlled form with validation. It saves nothing yet. Step 9 sends orders to the backend.
- All data is demo data and clearly labelled.

## Problems faced and fixes
- Card padding: the `p-0` class did not override the card's default `p-5` (both have the same priority). Fix: used a plain `div` with the `glass` class for the watchlist list.
- Testing a preview server in a script: a background process stopped when the command ended. Fix: start the server and run the test in the same command.

## Interview questions
1. What are nested routes and what does `<Outlet />` do?
2. What is React Context? Why not pass props down?
3. Why is the P&L maths in a custom hook?
4. How does `useEffect` cleanup stop the price timer?
5. How would you replace the mock data with a real API? (Answer: Step 6.)
6. How does your table sort, and why is the sorted list wrapped in `useMemo`?
7. How did you make the dashboard work on a phone?
