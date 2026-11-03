# Step 4d: One Black Look for the Whole Site

## Goal
Make the website and the dashboard feel like the black 3D explore page.

## What changed
- `index.css` (both apps): pure black palette, thin lines, flat panels, serif headings (Playfair Display), no gradients
- `Button.jsx`: outlined and white pill buttons with small spaced capitals
- `Cursor.jsx`: soft dot cursor that grows over links and buttons
- `DashboardLayout.jsx`: the sidebar became a header with a full-screen wipe-down menu, a big serif page title, and a fade between pages
- `Navbar.jsx` and `Home.jsx`: Explore 3D link, cursor, no theme toggle
- `tailwind.config.js`, `index.html`, `useTheme.js`: serif font, softer glow, fonts, black by default

## How it works (simple words)
- Every colour in the app comes from five CSS variables (`--bg`, `--card`, `--line`, `--ink`, `--mute`). Changing them restyled almost every component at once. This is why a design system pays off.
- The menu is a full-screen layer hidden with `clip-path`. Opening it animates the clip-path to show it.
- The header uses `mix-blend-mode: difference`, so white text stays readable on any background.

## Interview questions
1. Why use CSS variables for theming? How does Tailwind read them here?
2. How does `clip-path` create the menu wipe effect?
3. How did you keep the site accessible (focus outline, `inert`, reduced motion)?
