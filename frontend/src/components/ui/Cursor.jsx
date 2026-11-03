import { useEffect, useRef } from 'react';

// Soft dot that follows the mouse (mouse users only). It grows over links and buttons.
export default function Cursor() {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const dot = ref.current;
    let mx = -99, my = -99, x = -99, y = -99, raf;
    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const over = (e) => dot.classList.toggle('wide', !!e.target.closest?.('a,button,select,input,[role=button]'));
    const tick = () => { x += (mx - x) * 0.2; y += (my - y) * 0.2; dot.style.transform = `translate3d(${x}px,${y}px,0)`; raf = requestAnimationFrame(tick); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    tick();
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerover', over); cancelAnimationFrame(raf); };
  }, []);
  return <div ref={ref} id="tn-cursor" aria-hidden="true" />;
}
