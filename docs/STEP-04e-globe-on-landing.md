# Step 4e: The 3D Globe Inside the Landing Page

## Goal
Show the 3D globe of charts on the main page, not only on its own page.

## What changed
- `frontend/public/explore/index.html`: new "embed mode" (`?embed=1`) that hides the splash, intro film, menu and scroll zoom
- `frontend/src/components/landing/Sphere.jsx` (new): a section with the globe inside an `<iframe>`
- `Home.jsx`, `Navbar.jsx`: the section is added and "Explore 3D" now jumps to it
- `Hero.jsx`: "a rupee." stays on one line (`whitespace-nowrap`)

## How it works (simple words)
- An iframe is a page inside a page. The globe page runs by itself inside the box, so its code did not need to be rewritten in React.
- The page reads `?embed=1` from the address (`URLSearchParams`). If it is there, it skips the intro and hides the extra controls.
- The iframe is `loading="lazy"`: it only loads when the visitor scrolls near it, which keeps the first page load fast.

## Interview questions
1. What is an iframe? What are its pros and cons (security, performance, styling)?
2. How does a page read query parameters from its URL?
3. Why did you embed the page instead of rewriting it in React? When would a rewrite be better?
