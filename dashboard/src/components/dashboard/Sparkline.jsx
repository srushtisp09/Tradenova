// Tiny line chart used inside watchlist rows.
export default function Sparkline({ data, up }) {
  const W = 96, H = 32;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => `${i ? 'L' : 'M'}${((i / (data.length - 1)) * W).toFixed(1)},${(H - 3 - ((v - min) / (max - min || 1)) * (H - 6)).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-8 w-24" aria-hidden="true">
      <path d={pts} fill="none" stroke={up ? '#22C55E' : '#EF4444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
