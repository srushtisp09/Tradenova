import { signedInr, signedPct } from '../../utils/format';

// Shows a profit/loss number in green or red with a + or − sign.
export function Change({ value, kind = 'inr', className = '' }) {
  const text = kind === 'pct' ? signedPct(value) : signedInr(value);
  return <span className={`num ${value >= 0 ? 'text-profit' : 'text-loss'} ${className}`}>{text}</span>;
}
