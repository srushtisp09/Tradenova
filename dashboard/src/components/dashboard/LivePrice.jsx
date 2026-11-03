import { useEffect, useRef, useState } from 'react';
import { inr } from '../../utils/format';

// Shows a price and flashes green (went up) or red (went down) when it changes.
export default function LivePrice({ value }) {
  const prev = useRef(value);
  const [dir, setDir] = useState(0);

  useEffect(() => {
    if (value === prev.current) return;
    setDir(value > prev.current ? 1 : -1);
    prev.current = value;
    const t = setTimeout(() => setDir(0), 700);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <span className={`num rounded px-1 transition-colors duration-500 ${dir > 0 ? 'bg-profit/25' : dir < 0 ? 'bg-loss/25' : ''}`}>
      {inr(value)}
    </span>
  );
}
