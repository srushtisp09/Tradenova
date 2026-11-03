# Step 2: Design System

## Goal
Create one shared look (colors, fonts, reusable components) for both the `frontend` and `dashboard` apps, so every later page looks consistent and premium.

## Files created (same in both apps)
- `tailwind.config.js`: colors, fonts, animations
- `postcss.config.js`: lets Tailwind run inside Vite
- `index.html`: loads the Inter and JetBrains Mono fonts
- `src/index.css`: dark/light colors, glass card style, gradient text
- `src/hooks/useTheme.js`: dark/light toggle, saved in localStorage
- `src/utils/cn.js`: small helper to join class names
- `src/components/ui/`: Button, Card, Badge, Input, Modal, Skeleton, ThemeToggle
- `src/pages/Design.jsx`: preview page at `/design`
- `src/App.jsx`, `src/main.jsx`: routes and app start

## How it works (simple words)
- Colors are stored as CSS variables. The `dark` class on `<html>` swaps their values, so one class changes the whole site.
- Tailwind reads those variables, so `bg-card` or `text-mute` works in both themes.
- `.glass` = blurred, see-through card with a soft border (glassmorphism).
- Components are small reusable pieces. Change Button once, every button changes.
- Prices use the mono font (`.num`) so digits line up neatly.
- `prefers-reduced-motion` is respected for accessibility.

## Problems faced and fixes
- **Error:** `CssSyntaxError` from `expandApplyAtRules` when running `npm run dev`.
  **Cause:** Tailwind v3 and v4 use different setups. A mismatch (or an `@apply` using a class that is not defined) breaks the CSS build.
  **Fix:** Pinned Tailwind to `3.4.17`, defined every custom color in `tailwind.config.js`, and used only defined classes inside `@apply`.
- **Error:** "Individual quota reached" in Antigravity.
  **Fix:** Built the step outside the agent and copied the files in.

## Interview questions
1. What is Tailwind CSS and why use it over plain CSS?
2. What is a design system and why build one early?
3. How does dark mode work in this project?
4. What is a reusable component? Give an example from this project.
5. What is mobile-first design?
6. What does `@apply` do and what can go wrong with it?
