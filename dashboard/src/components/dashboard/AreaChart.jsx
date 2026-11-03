import { useId, useState } from 'react';
import { inr } from '../../utils/format';

const W = 800, H = 280, PAD = 12;

// Area chart drawn with SVG. Move the mouse (or finger) over it to see the value on that day.
export default function AreaChart({ data, labels }) {
  const id = useId();
  const [hover, setHover] = useState(null);

  const min = Math.min(...data), max = Math.max(...data);
  const x = (i) => PAD + (i / (data.length - 1)) * (W - PAD * 2);
  const y = (v) => H - PAD - ((v - min) / (max - min || 1)) * (H - PAD * 2 - 10);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1)},${H} L${x(0)},${H} Z`;

  const pick = (clientX, rect) => {
    const rel = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    setHover(Math.round(rel * (data.length - 1)));
  };
  const i = hover ?? data.length - 1;

  return (
    <div className="relative">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <p className="num text-2xl font-semibold">{inr(data[i])}</p>
        <p className="text-sm text-mute">{labels[i]}</p>
      </div>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full touch-pan-y"
        role="img"
        aria-label="Portfolio value over the last 30 days"
        onMouseMove={(e) => pick(e.clientX, e.currentTarget.getBoundingClientRect())}
        onTouchMove={(e) => pick(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`${id}-l`} x1="0" x2="1"><stop offset="0" stopColor="#3B82F6" /><stop offset="1" stopColor="#8B5CF6" /></linearGradient>
          <linearGradient id={`${id}-f`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3B82F6" stopOpacity="0.3" /><stop offset="1" stopColor="#3B82F6" stopOpacity="0" /></linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="currentColor" className="text-line" strokeDasharray="4 6" />
        ))}
        <path d={area} fill={`url(#${id}-f)`} />
        <path d={line} fill="none" stroke={`url(#${id}-l)`} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <line x1={x(i)} x2={x(i)} y1="0" y2={H} stroke="#8B5CF6" strokeOpacity="0.4" />
        <circle cx={x(i)} cy={y(data[i])} r="6" fill="#8B5CF6" />
      </svg>
    </div>
  );
}
