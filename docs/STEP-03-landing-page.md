# Step 3: Landing Page (frontend app)

## Goal
Build the public home page of TradeNova: navbar, hero with a live-moving chart, price ticker, features, pricing, support (FAQ), open-account form and footer. Fully responsive, dark and light mode.

## Files created or changed (all inside `frontend/src`)
- `pages/Home.jsx`: puts all sections together
- `components/landing/Navbar.jsx`: sticky glass navbar, mobile menu
- `components/landing/Hero.jsx` and `HeroChart.jsx`: headline and live SVG chart
- `components/landing/MarketTicker.jsx`: scrolling strip of demo prices
- `components/landing/Features.jsx`, `Pricing.jsx`, `Support.jsx`
- `components/landing/OpenAccount.jsx`: sign-up form with validation
- `components/landing/Footer.jsx`
- `hooks/useLivePrice.js`: fake live price (random walk, updates every 1.2 s)
- `utils/format.js`: formats numbers as Indian rupees
- `App.jsx` (routes) and `index.css` (smooth scroll + ticker animation)

## How it works (simple words)
- The page is split into small components. `Home.jsx` just lists them in order.
- Menu links like `#pricing` jump to the section with that `id`. `scroll-mt-20` stops the sticky navbar from covering the title.
- The hero chart is an SVG. Each new price becomes a point; the points are turned into a line path (`M` move, `L` line). The array drops its oldest value and adds a new one every 1.2 s, so the chart seems to move.
- `useLivePrice` is a custom hook: it keeps the data and the timer, and the chart only draws it.
- The ticker repeats its content twice and slides left by 50 percent in a loop, so it looks endless.
- The form checks name, email and a 10-digit Indian mobile number. If something is wrong it shows an error under that field. If all is good, a modal opens. Step 7 sends it to the backend.
- All prices on this page are simulated demo data and are labelled that way.

## Problems faced and fixes
- Chart end dot was cut off at the right edge. Fix: added padding to the x position.
- A stat label wrapped badly on phones. Fix: used a shorter label.

## Interview questions
1. What is a custom hook? Why did you make `useLivePrice`?
2. How does an SVG path work? How is the chart line drawn?
3. How does `setInterval` cleanup work in `useEffect`, and what happens without it?
4. How do you make a page responsive? Show an example from this project.
5. How do you validate a form on the client? Why must the server validate too?
6. What is a controlled input in React?
