import useLivePrice from '../../hooks/useLivePrice';
import { inr } from '../../utils/format';
import { Badge } from '../ui';

const W = 600, H = 240;

// The memorable moment of the page: a live-moving price chart drawn in SVG.
export default function HeroChart() {
  const s = useLivePrice(2450, 48);
  const min = Math.min(...s), max = Math.max(...s);
  const x = (i) => 8 + (i / (s.length - 1)) * (W - 24);
  const y = (v) => H - 16 - ((v - min) / (max - min || 1)) * (H - 40);

  const line = s.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H} L0,${H} Z`;
  const last = s[s.length - 1];
  const change = ((last - s[0]) / s[0]) * 100;
  const up = change >= 0;

  return (
    <div className="glass p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-mute">NOVA Ltd · simulated</p>
          <p className="num mt-1 text-3xl font-semibold sm:text-4xl">{inr(last)}</p>
        </div>
        <Badge tone={up ? 'profit' : 'loss'}>{up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%</Badge>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-auto w-full" role="img" aria-label="Simulated live price chart">
        <defs>
          <linearGradient id="hc-line" x1="0" x2="1">
            <stop offset="0" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="hc-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3B82F6" stopOpacity="0.35" />
            <stop offset="1" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="currentColor" className="text-line" strokeDasharray="4 6" />
        ))}
        <path d={area} fill="url(#hc-fill)" />
        <path d={line} fill="none" stroke="url(#hc-line)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={x(s.length - 1)} cy={y(last)} r="5" fill="#8B5CF6" />
        <circle cx={x(s.length - 1)} cy={y(last)} r="11" fill="#8B5CF6" opacity="0.25" className="animate-pulse" />
      </svg>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="rounded-xl bg-profit/15 py-3 font-semibold text-profit transition hover:bg-profit/25">Buy</button>
        <button className="rounded-xl bg-loss/15 py-3 font-semibold text-loss transition hover:bg-loss/25">Sell</button>
      </div>
    </div>
  );
}
