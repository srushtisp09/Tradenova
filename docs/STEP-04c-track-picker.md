# Step 4c: Track Picker with Nova the Bull

## Goal
Replace the plain card screen with a scene: a black stage, moving market charts, and a cute bull mascot who asks which path the visitor wants.

## Files
- `dashboard/src/components/dashboard/TrackPicker.jsx` (rewritten)
- `dashboard/index.html` (adds the Playfair Display font)

## How it works (simple words)
- **Backdrop:** eight small chart cards float with CSS keyframe animations. A big line redraws itself using `stroke-dashoffset`. Two ticker strips scroll in opposite directions.
- **memo:** the backdrop is wrapped in `memo`, so React never redraws it while the text types. That keeps the animation smooth.
- **Nova:** drawn as SVG shapes (circles, ellipses, paths). CSS animations make it ride in, bob, blink and jump.
- **Typewriter:** a timer adds one letter every 28 ms. Clicking the bubble skips it. A hidden copy of the full text keeps the bubble from changing size and is read aloud by screen readers.
- **Choosing:** Nova jumps and says "Great choice!", then after about one second the track is saved and the page changes.

## Interview questions
1. How do CSS keyframes differ from animating with JavaScript? When do you pick each?
2. Why wrap a component in `memo`?
3. How does `stroke-dashoffset` make a line draw itself?
4. How did you keep the mascot and the animations accessible (reduced motion, screen readers)?
