# Step 7: User Authentication (JWT & bcrypt)

## Goal
Add real user accounts with password hashing (bcrypt) and stateless session tokens (JWT) so traders have private portfolios and watchlists.

## Endpoints
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new user, hash password, create ₹10,00,000 cash balance |
| `POST` | `/api/auth/login` | Verify credentials, return signed JWT bearer token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & preferences |

## Security & Architecture
- **Password Safety**: Passwords hashed with 10 salt rounds via `bcryptjs`.
- **JWT Authorization**: Requests include `Authorization: Bearer <token>` in headers.
- **Graceful Fallback**: If no token is provided, requests seamlessly default to the demo paper account so users can still preview the trading platform.
