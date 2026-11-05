# Step 7: Authentication & User Accounts (JWT & bcryptjs)

## 1. Goal
Add real user authentication with password hashing and JSON Web Tokens (JWT). Every user now has their own private account, initial ₹10,00,000 in virtual cash, separate holdings, positions, and watchlists, while the demo trader account remains available for exploration.

---

## 2. Files Changed & Added

### Backend
- [backend/package.json](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/package.json): Added `bcryptjs` and `jsonwebtoken`.
- [backend/models/User.js](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/models/User.js): Holds `name`, `email`, `passwordHash`, `track`, `cash` (₹10,00,000 default), and `watchlist`.
- [backend/middleware/requireAuth.js](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/middleware/requireAuth.js): Inspects `Authorization: Bearer <token>`, verifies JWT, validates `process.env.JWT_SECRET`, loads user without `passwordHash`, and returns `401 { "error": "Please log in" }` when missing or invalid.
- [backend/routes/auth.js](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/routes/auth.js):
  - `POST /api/auth/register`: Validates name, email, 8+ char password; hashes password with 10 salt rounds; initializes 10L cash balance, empty holdings, and empty watchlist; returns `{ token, user }`.
  - `POST /api/auth/login`: Verifies email and password; returns constant generic message `"Invalid email or password"` on any mismatch.
  - `GET /api/auth/me`: Protected endpoint returning user details (excluding `passwordHash`).
  - `PATCH /api/auth/me`: Updates selected track (`beginner` or `pro`).
- [backend/server.js](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/server.js): Replaced demoUser with `requireAuth` on `/api/portfolio`, `/api/watchlist`, and `/api/orders`. Public routes remain `/api/health`, `/api/instruments`, `/api/auth/register`, and `/api/auth/login`.
- [backend/seed.js](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/backend/seed.js): Seeds `demo@tradenova.dev` with hashed password for `Demo@1234`.

### Dashboard
- [dashboard/src/services/api.js](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/services/api.js): Uses localStorage key `tradenova-token`, attaches `Authorization: Bearer <token>`, and automatically clears session and redirects to `/login` on `401`.
- [dashboard/src/context/AuthContext.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/context/AuthContext.jsx): Provides `{ user, token, isLoggedIn, loading, login, register, logout, updateUserTrack }`. Verifies token with `GET /api/auth/me` on mount.
- [dashboard/src/components/auth/ProtectedRoute.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/components/auth/ProtectedRoute.jsx): Blocks unauthenticated access and redirects to `/login`.
- [dashboard/src/pages/Login.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Login.jsx): Styled with black theme, thin borders, serif headings; includes demo login button (`demo@tradenova.dev` / `Demo@1234`), pre-filling via `?email=...`, show/hide password toggle, and server error messages.
- [dashboard/src/pages/Register.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Register.jsx): User registration with name, email, password (min 8 chars), track choice (Beginner or Pro), and pre-filling via `?name=...&email=...`.
- [dashboard/src/components/layout/DashboardLayout.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/components/layout/DashboardLayout.jsx): Displays logged-in user name and Log out button in header and full-screen menu; track picker button syncs via `PATCH /api/auth/me`.
- [dashboard/src/components/dashboard/TrackPicker.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/components/dashboard/TrackPicker.jsx): Skips automatically when user already has an assigned track.
- [dashboard/src/pages/Overview.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Overview.jsx), [Holdings.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Holdings.jsx), [Positions.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Positions.jsx), [Insights.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/dashboard/src/pages/Insights.jsx): Safe against zero holdings/positions, prevents `NaN` or division by zero, shows friendly zero-state messages, and shows the 30-day performance chart only when history exists.

### Frontend (Website)
- [frontend/src/components/landing/OpenAccount.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/frontend/src/components/landing/OpenAccount.jsx): Redirects visitors to dashboard `${VITE_DASHBOARD_URL}/register?name=...&email=...` with URL encoding.
- [frontend/src/components/landing/Navbar.jsx](file:///c:/Users/Hp/OneDrive/Desktop/tradenova/frontend/src/components/landing/Navbar.jsx): "Log in" links directly to `/login` and "Open account" links to `/register`.

---

## 3. How It Works (In Simple Words)
1. **Signing Up**: When a trader registers on the website or dashboard, their password is salted and hashed using `bcryptjs` before it ever reaches the database. The server saves the user with ₹10,00,000 cash and empty stock holdings.
2. **Logging In**: The user enters their email and password. The backend checks the hash with `bcrypt.compare`. If valid, it signs a JWT token containing `{ id }` with a 7-day expiration.
3. **Session Management**: The browser saves this token in `localStorage` under `"tradenova-token"`. Each API call sends it in the `Authorization: Bearer <token>` header.
4. **Guarding Routes**: `requireAuth` on the backend validates the token for protected routes (`/api/portfolio`, `/api/watchlist`, `/api/orders`). If missing, expired, or tampered with, it sends `401 { "error": "Please log in" }`. The dashboard's `api.js` detects `401`, clears storage, and redirects the trader to `/login`.
5. **Fresh User Experience**: New accounts start with empty holdings. The dashboard pages detect this and display friendly welcome guides instead of broken graphs, zero-division glitches, or `NaN` values.

---

## 4. Problems Encountered & Fixes
- **Problem**: `dotenv` did not load `.env` from the project root when Node was executed from outside `backend/`.
  - **Fix**: Running scripts with working directory set to `backend` or running server inside `backend/` ensures `dotenv/config` reliably picks up `backend/.env`.
- **Problem**: `ProtectedRoute` had an incorrect relative import depth for `AuthContext`.
  - **Fix**: Adjusted the path to `../../context/AuthContext` so `npm run build` completed cleanly without errors.
- **Problem**: Zero holdings on `Overview` and `Insights` could cause zero division (`totals.value = 0` leading to `s.value / totals.value -> NaN`).
  - **Fix**: Guarded all weight calculations with `totalValue > 0 ? ... : 0` and displayed empty-state guidance with buttons to explore the watchlist.

---

## 5. Six Interview Questions & Answers

### Q1: Why use `bcryptjs` instead of standard `bcrypt` in Node.js?
**Answer**: `bcrypt` is a C++ native addon that requires Python and C++ compilation tools (`node-gyp`) on the host machine. In many environments (especially Windows or minimalist containers), native builds fail or require heavyweight build tools. `bcryptjs` is pure JavaScript, requires zero native build tools, and runs reliably anywhere Node.js runs.

### Q2: Why keep the JWT payload small (e.g. only `{ id }`) instead of storing the entire user object?
**Answer**:
1. **Size**: Tokens are sent in every HTTP request header; larger payloads increase network overhead.
2. **Staleness**: If user data (like name, email, or track) changes in the database, a token storing that data becomes out-of-date until expired. Storing only the immutable `id` allows the backend to fetch fresh user state on demand.
3. **Security**: JWTs are base64-encoded, not encrypted. Anyone who inspects the token can read the payload.

### Q3: Why return the exact same error ("Invalid email or password") for both wrong email and wrong password?
**Answer**: To protect against user enumeration attacks. If the server responded with "Email not found", an attacker could test a list of email addresses to discover which ones are registered users on the platform.

### Q4: Why can't the frontend website (port 5173) read `localStorage` tokens from the dashboard (port 5174)?
**Answer**: The browser's Same-Origin Policy isolates `localStorage` by origin (protocol + domain + port). Because port 5173 and port 5174 are distinct origins, the website cannot access the dashboard's storage. Passing user intent via query parameters (`/register?name=...&email=...`) bridges the flow securely.

### Q5: How do we prevent timing attacks during password verification?
**Answer**: `bcrypt.compare` uses a constant-time comparison algorithm under the hood, ensuring the response time does not leak how many characters of the password or hash were matched.

### Q6: What happens if `process.env.JWT_SECRET` is unset or undefined?
**Answer**: If a library uses a default fallback or `undefined`, tokens can be easily forged by attackers who know the default secret. TradeNova checks for `process.env.JWT_SECRET` upon startup and in auth middleware, stopping execution or returning a 500 error immediately if the secret is missing.
