# Step 6: Connect Frontend & Dashboard to Backend API

## Goal
Wire the React dashboard to read and write live data against the Express + MongoDB backend API, moving away from hardcoded mock objects.

## Changes Made
1. **API Client (`dashboard/src/services/api.js`)**:
   - Centralized fetch service with bearer token support for `/api/instruments`, `/api/portfolio`, `/api/watchlist`, and `/api/orders`.
2. **Dynamic Live Trading Context (`dashboard/src/context/TradingContext.jsx`)**:
   - Fetches official instrument data from `/api/instruments`.
   - Runs simulated live tick updates every 2 seconds.
3. **Dynamic Portfolio Hook (`dashboard/src/hooks/usePortfolio.js`)**:
   - Fetches user holdings (`/api/portfolio/holdings`), intraday positions (`/api/portfolio/positions`), and overall net worth/cash (`/api/portfolio`).
   - Computes real-time PnL and day changes dynamically as live quotes tick.
4. **Interactive Watchlist (`dashboard/src/pages/Watchlist.jsx`)**:
   - Fetches saved watchlist from MongoDB Atlas (`/api/watchlist`).
   - Adding and removing stocks persists changes to MongoDB via `POST /api/watchlist` and `DELETE /api/watchlist/:symbol`.
5. **Real Order Placement & History (`dashboard/src/components/dashboard/OrderModal.jsx` & `dashboard/src/pages/Orders.jsx`)**:
   - Submits paper orders to MongoDB Atlas via `POST /api/orders`.
   - Displays real-time order history table from `GET /api/orders`.
