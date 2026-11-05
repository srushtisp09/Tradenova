# Step 8: Live Market Prices & Real Charts

## 1. Goal
Connect the TradeNova platform to live financial market data using Yahoo Finance (`yahoo-finance2`), update instrument prices in MongoDB, poll fresh quotes periodically without overloading unofficial upstream endpoints, and replace static SVG visualizations with interactive Chart.js charts (stock detail line charts, 30-day portfolio growth line chart, and holdings allocation doughnut chart).

---

## 2. Files Changed & Added

### Backend
- [`backend/package.json`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/package.json): Added `yahoo-finance2` dependency.
- [`backend/env.example`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/env.example) and [`backend/.env.example`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/.env.example): Added documentation for `LIVE_DATA=true`.
- [`backend/models/PortfolioSnapshot.js`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/models/PortfolioSnapshot.js): Mongoose model capturing `{ user, date (YYYY-MM-DD), netWorth }` with a compound unique index on `{ user: 1, date: 1 }`.
- [`backend/services/marketData.js`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/services/marketData.js):
  - Maps internal symbols to Yahoo Finance format (`TCS` -> `TCS.NS`, `NIFTY` -> `^NSEI`, `SENSEX` -> `^BSESN`).
  - Batch queries quotes using `yahooFinance.quote()`.
  - Caches quotes in memory for 15 seconds.
  - Updates prices and previous close in the `Instrument` collection using a single `Instrument.bulkWrite`.
  - Missing or delisted symbols (e.g. `TATAMOTORS`) retain their stored database values with a concise warning log.
  - Fetches historical candlestick data via `yahooFinance.chart()` for ranges `1d` (5m interval), `5d` (15m interval), `1mo` (1d interval), `6mo` (1d interval), and `1y` (1wk interval), with 60-second in-memory caching.
- [`backend/routes/quotes.js`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/routes/quotes.js): Public `GET /api/quotes` returning `{ source: "live" | "simulated", updatedAt, quotes }`.
- [`backend/routes/instruments.js`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/routes/instruments.js): Added public `GET /api/instruments/:symbol/history?range=1mo` validating accepted ranges.
- [`backend/routes/portfolio.js`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/routes/portfolio.js):
  - `GET /api/portfolio`: Calculates current portfolio totals and upserts today's snapshot into `PortfolioSnapshot`.
  - `GET /api/portfolio/history`: Returns up to the last 30 daily snapshots for the authenticated user, sorted chronologically (oldest first).
- [`backend/server.js`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/server.js): Mounted `/api/quotes` router.

### Dashboard
- [`dashboard/package.json`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/package.json): Installed `chart.js` and `react-chartjs-2`.
- [`dashboard/src/components/charts/chartConfig.js`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/components/charts/chartConfig.js): Selective registration of Chart.js elements (`CategoryScale`, `LinearScale`, `PointElement`, `LineElement`, `Title`, `Tooltip`, `Filler`, `Legend`, `ArcElement`) to maintain a lean production bundle.
- [`dashboard/src/services/api.js`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/services/api.js): Added `getQuotes`, `getInstrumentHistory`, and `getPortfolioHistory`.
- [`dashboard/src/context/TradingContext.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/context/TradingContext.jsx):
  - Polls `GET /api/quotes` every 10 seconds.
  - Automatically pauses polling when the browser tab is hidden using `document.visibilitychange`.
  - Applies micro random ticks strictly when `quoteSource === 'simulated'`. When `live`, real quotes dictate prices.
  - Exposes `quoteSource`, `updatedAt`, `selectedStock`, `openStockDetail`, and `closeStockDetail`.
- [`dashboard/src/components/layout/DashboardLayout.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/components/layout/DashboardLayout.jsx):
  - Top bar pill badge indicating `"Live (may be delayed)"` or `"Simulated prices"`.
  - Educational disclaimer badge and footer note stating data originates from Yahoo Finance (unofficial) for learning only.
  - Renders global `StockDetailModal`.
- [`dashboard/src/components/charts/PriceChart.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/components/charts/PriceChart.jsx):
  - Chart.js area line chart with blue-to-violet gradient line and fill.
  - End-color switches to emerald green or crimson red based on whether range net price changed positively or negatively.
  - Range toggle buttons (`1D`, `1W`, `1M`, `6M`, `1Y`).
  - Dark-mode tooltip displaying formatted date/time and currency in ₹.
  - Loading skeleton state and error retry state.
- [`dashboard/src/components/dashboard/StockDetailModal.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/components/dashboard/StockDetailModal.jsx):
  - Detailed modal view with live ticker price, day change, sector badge, interactive `PriceChart`, and Buy/Sell trigger buttons.
- [`dashboard/src/pages/Watchlist.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Watchlist.jsx), [`Holdings.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Holdings.jsx), [`Insights.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Insights.jsx):
  - Clicking any stock symbol in watchlist rows, holdings table, or top gainers/losers opens the `StockDetailModal`.
- [`dashboard/src/components/dashboard/PortfolioGrowthChart.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/components/dashboard/PortfolioGrowthChart.jsx):
  - Chart.js line chart using real historical snapshots.
  - Displays placeholder notice when fewer than 2 snapshots exist: *"Your growth chart appears after your first two days."*
- [`dashboard/src/components/dashboard/HoldingsDoughnut.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/components/dashboard/HoldingsDoughnut.jsx):
  - Chart.js doughnut chart breaking down top 5 holdings and an aggregated "Others" bucket, with centered value display and legend.
- [`dashboard/src/pages/Overview.jsx`](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Overview.jsx):
  - Replaced SVG charts with `PortfolioGrowthChart` and `HoldingsDoughnut`.

---

## 3. How It Works (In Simple Words)

1. **Fetching Live Stock Prices**: When the backend starts, `services/marketData.js` transforms symbols like `RELIANCE` into `RELIANCE.NS`, and `NIFTY` into `^NSEI`. It makes a single combined request to Yahoo Finance.
2. **Caching to Protect Quotas**: Because Yahoo Finance's API is unofficial and rate-limited, results are stored in Node.js memory for 15 seconds. If dozens of users refresh at the same time, the server returns the cached response without pinging Yahoo again.
3. **Database Synchronization**: Whenever fresh live quotes arrive, an `Instrument.bulkWrite` updates the MongoDB documents. This guarantees that portfolio valuations, margin calculations, and order execution utilize real market rates.
4. **Resilient Fallback**: If Yahoo Finance is unreachable or `LIVE_DATA=false` is set in the environment, the API automatically falls back to `"simulated"` source, keeping the app completely functional with stored demo values.
5. **Smart Polling on Dashboard**: The trading dashboard polls `/api/quotes` every 10 seconds. When a trader switches browser tabs or minimizes the window, the `visibilitychange` listener immediately pauses requests, saving bandwidth and battery.
6. **Portfolio History & Growth**: Every time a user checks their portfolio, today's total net worth is upserted into the `PortfolioSnapshot` collection. Once two or more daily snapshots exist, a Chart.js line chart plots their growth.

---

## 4. Problems Encountered & Fixes

- **Problem 1: `yahoo-finance2` v3 options schema requires `period1` for charts**: Passing `{ range: '1mo' }` threw an `InvalidOptionsError: schemaPath #/definitions/ChartOptions/required`.
  - **Fix**: Calculated `period1` timestamp explicitly from the target range (e.g. `now - 31 days` for `1mo`) along with the appropriate `interval` (`5m`, `15m`, `1d`, `1wk`).
- **Problem 2: Symbol renaming on NSE (e.g., Tata Motors demerger)**: `TATAMOTORS.NS` returned empty quotes on Yahoo Finance due to corporate restructuring.
  - **Fix**: Programmed `fetchQuotes` to skip missing symbols gracefully, log a single concise warning (`[marketData] Missing live quote for TATAMOTORS, kept stored price`), and retain their existing database price.
- **Problem 3: Tree-shaking Chart.js bundle size**: Importing the full Chart.js library adds unnecessary bundle weight.
  - **Fix**: Created `chartConfig.js` registering only `CategoryScale`, `LinearScale`, `PointElement`, `LineElement`, `ArcElement`, `Tooltip`, `Legend`, and `Filler`.
- **Problem 4: Windows PowerShell port binding in tests**: Background processes left ports open during automated testing.
  - **Fix**: Identified open sockets via `netstat -ano` and terminated orphaned processes gracefully before launching clean test instances.

---

## 5. Six Interview Questions & Answers

### Q1: Why cache market quotes in memory on the backend for 15 seconds instead of letting each frontend client call Yahoo Finance directly?
**Answer**:
1. **Security & CORS**: Yahoo Finance does not serve open CORS headers for browser frontends, requiring a backend proxy or server-to-server call.
2. **Rate Limits & IP Bans**: Unofficial APIs enforce aggressive IP rate limits. By caching on the backend, 1,000 active frontend clients generate at most 4 upstream requests per minute.
3. **Data Consistency**: Having a centralized quote cache ensures that every user and every backend portfolio calculation sees consistent prices.

### Q2: What is `bulkWrite` in MongoDB and why is it preferred over `Promise.all(instruments.map(i => updateOne(...)))`?
**Answer**:
`Promise.all` with individual `updateOne` calls sends multiple round-trip network packets across the wire to the database cluster (e.g. 14 round-trips for 14 instruments). `Instrument.bulkWrite()` packages all 14 update operations into a single network packet sent over the MongoDB wire protocol, reducing latency, connection pool pressure, and database CPU overhead.

### Q3: Why is pausing polling on `document.hidden` important in single-page applications?
**Answer**:
When users keep multiple dashboard tabs open in the background, continuous polling wastes client CPU, drains mobile battery, and floods backend servers with unnecessary requests. Listening to `visibilitychange` stops network activity while backgrounded and triggers an immediate refresh as soon as the user refocuses the tab.

### Q4: How does Chart.js tree-shaking work with `Chart.register(...)`?
**Answer**:
Chart.js version 3+ was rewritten in ES modules with modular components. If you import the standard `chart.js/auto`, all controllers, scales, elements, and plugins (radar, polar area, bar, etc.) are included in the JavaScript bundle. By importing only the specific elements used (e.g. `LineElement`, `ArcElement`) and registering them with `ChartJS.register(...)`, the bundler (Vite) treeshakes away unused code, cutting bundle size significantly.

### Q5: Why store portfolio snapshots keyed by `YYYY-MM-DD` string instead of raw timestamps?
**Answer**:
Daily net-worth tracking requires at most one value per calendar day. Storing a formatted date string (`YYYY-MM-DD`) along with a compound unique index on `{ user: 1, date: 1 }` allows atomic upserts (`findOneAndUpdate` with `upsert: true`). Any number of visits throughout the same day update that day's closing valuation without creating duplicate entries.

### Q6: How does the backend maintain graceful degradation if live market data fails completely?
**Answer**:
All calls to `yahooFinance` are wrapped in `try/catch` blocks. If an upstream network timeout, DNS error, or rate-limit occurs, the backend falls back to returning the stored MongoDB instrument prices with `{ source: "simulated" }`. The frontend detects this flag, displays the "Simulated prices" badge, and resumes smooth micro-tick simulations so the user interface never appears frozen or broken.

---

## 6. How to Test in the Browser

1. **Start the Backend**:
   ```powershell
   cd backend
   node server.js
   ```
   *Expected output: `MongoDB connected` and `API running on http://localhost:5000`.*

2. **Start the Dashboard**:
   ```powershell
   cd dashboard
   npm run dev
   ```
   *Runs on `http://localhost:5174`.*

3. **Verify in Browser**:
   - Open `http://localhost:5174/login` and click **"Try demo trader"** (or use `demo@tradenova.dev` / `Demo@1234`).
   - Check the **Top Bar**: notice the pill badge displaying **"Live (may be delayed)"** with a pulsing green indicator.
   - Go to **Overview**: inspect the new 30-day **Portfolio growth** line chart and the **Where your money is** doughnut chart showing asset allocation with legend.
   - Go to **Watchlist**: click on any stock ticker (e.g. **TCS**, **RELIANCE**, or **INFY**).
   - Observe the **Stock Detail Modal**: test switching timeframes (`1D`, `1W`, `1M`, `6M`, `1Y`) to see the real candlestick line chart change, hover to check rupee tooltips, and click **Buy** or **Sell** to test launching the order window.
   - Go to **Insights**: click on any stock in **Top gainers** or **Top losers** to open its real price chart modal.
