# Step 4b: Two Tracks (Beginner and Pro)

## Goal
Serve two kinds of users in one app: 🌱 beginners who are new to the market, and 📈 professionals who already trade.

## What was added
**Dashboard** (`dashboard/src`)
- `context/TrackContext.jsx`: remembers the chosen track and learning progress (saved in localStorage)
- `components/dashboard/TrackPicker.jsx`: full-screen chooser on first visit
- `components/layout/DashboardLayout.jsx` (changed): track switch in the top bar, menu changes by track
- `pages/Learn.jsx`, `components/learn/LessonPlayer.jsx`, `components/learn/Steps.jsx`, `data/lessons.js`: the beginner academy
- `pages/Insights.jsx`, `data/sectors.js`: the pro insights desk
- `App.jsx` (changed): new routes `/learn` and `/insights`

**Website** (`frontend/src`)
- `components/landing/Paths.jsx` and `pages/Home.jsx`: "Pick your path" section. Links carry `?track=beginner` or `?track=pro`.

## How it works (simple words)
- The chosen track is stored in React Context and in localStorage, so it survives a refresh.
- The menu is one list. Each item can say which tracks may see it (`tracks: ['pro']`). A small hook filters the list.
- A lesson is just data: a list of steps (text, tug-of-war, candle, calculator, quiz). One player component shows any lesson. Adding a lesson means adding data only.
- Quiz steps block the Next button until the answer is right. Finishing a lesson gives XP once. Every 100 XP is a level.
- Insights are rules of thumb checked against your portfolio: one stock above 18% of holdings, one sector above 35%, a holding down more than 3%, a gain above 20%, idle cash above 50%, open intraday positions.

## Problems faced and fixes
- The bottom bar had a fixed 5 columns, but the tracks have 4 and 6 menu items. Fix: the column count now comes from the number of items.

## Interview questions
1. How did you build two experiences in one app without duplicating code?
2. What is data-driven UI? Why are lessons stored as data?
3. How do you persist state across refreshes, and what can go wrong with localStorage?
4. How do your "what to change" rules work, and how would you test them?
5. How would you move the progress from localStorage to the database? (Answer: Step 5 and 7.)
