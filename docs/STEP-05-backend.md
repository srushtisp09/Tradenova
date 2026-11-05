# Step 5: Backend, Database Models and API

## Goal
Move the data out of the browser and into MongoDB, and serve it through a REST API.

## Setup (once)
1. Copy `backend/.env.example` to `backend/.env`.
2. Put your Atlas connection string in `MONGO_URI`. Replace `<db_password>` with your password and add the database name `/tradenova` before the `?`.
3. In the `backend` folder run `npm run seed`. It fills the database with demo data.
4. Run `npm run dev` from the project root.

## API (all JSON)
| Method | Address | What it does |
|---|---|---|
| GET | `/api/health` | Is the server (and database) up? |
| GET | `/api/instruments` | All stocks and indices |
| GET | `/api/instruments/:symbol` | One stock, e.g. `/api/instruments/TCS` |
| GET | `/api/portfolio` | Totals: net worth, P&L, cash |
| GET | `/api/portfolio/holdings` | Holdings with live P&L maths |
| GET | `/api/portfolio/positions` | Today's intraday positions |
| GET | `/api/watchlist` | Watchlist with prices |
| POST | `/api/watchlist` | Add `{ "symbol": "ITC" }` |
| DELETE | `/api/watchlist/:symbol` | Remove a stock |
| GET | `/api/orders` | The 50 newest orders |
| POST | `/api/orders` | Place an order (saved as OPEN) |

## Folder map (`backend/`)
- `models/`: what is stored (User, Instrument, Holding, Position, Order)
- `routes/`: one file per area of the API
- `services/portfolio.js`: the profit and loss maths
- `middleware/`: `requireDb`, `demoUser`, `errorHandler`
- `utils/`: `asyncHandler`, `HttpError`
- `data/seedData.js` and `seed.js`: demo data and the script that loads it
- `config/db.js`: connects to MongoDB

## How it works (simple words)
- A **schema** describes one kind of record (for example, a Holding has a user, symbol, qty and avgPrice). A **model** lets us save and find those records.
- A **route** answers one address. Middleware are small functions that run first (check the database, find the user).
- Every request acts as the demo user until login is added in Step 7. Only `middleware/demoUser.js` changes then.
- Orders are validated on the server (side, type, whole-number qty, limit price). Never trust the browser alone.
- `$addToSet` stops duplicates in the watchlist. A unique index (user + symbol) stops duplicate holdings.
- The seed script can be run again safely. It rebuilds only the demo user and the market data.

## Problems faced and fixes
- Without a database, every API call failed in a confusing way. Fix: `requireDb` middleware returns a clear 503 message. `/api/health` still works.

## Interview questions
1. What is REST? What do GET, POST and DELETE mean?
2. What is a Mongoose schema and model? How is MongoDB different from SQL?
3. What is middleware? Give two examples from this project.
4. Why validate on the server when the form already validates?
5. Why is the connection string kept in `.env` and not in git?
6. What is an index, and why did you add a unique one on user and symbol?
