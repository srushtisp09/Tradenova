import { useState } from 'react';
import { Button } from '../ui';
import { inr } from '../../utils/format';

// Interactive bits used inside lessons.

export function Tug() {
  const [price, setPrice] = useState(100);
  const [side, setSide] = useState(null);
  const push = (d) => { setPrice((v) => Math.max(60, Math.min(140, v + d))); setSide(d > 0 ? 'buy' : 'sell'); };
  return (
    <div>
      <p className="text-sm text-mute">Tap a button and watch the price.</p>
      <p className="num mt-2 text-4xl font-bold">₹{price}</p>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-line/40">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${((price - 60) / 80) * 100}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button onClick={() => push(6)}>🟢 Buyers rush in</Button>
        <Button variant="outline" onClick={() => push(-6)}>🔴 Sellers rush in</Button>
      </div>
      <p className="mt-3 min-h-10 text-sm">
        {side === 'buy' && 'More people want to buy, so sellers ask for more. The price rises.'}
        {side === 'sell' && 'More people want to sell, so they accept less. The price falls.'}
      </p>
    </div>
  );
}

export function Candle() {
  return (
    <div>
      <svg viewBox="0 0 240 170" className="w-full" role="img" aria-label="A green candle and a red candle">
        <g stroke="#22C55E" fill="#22C55E"><path d="M70 15V135" /><rect x="58" y="50" width="24" height="55" rx="2" /></g>
        <g stroke="#EF4444" fill="#EF4444"><path d="M170 15V135" /><rect x="158" y="50" width="24" height="55" rx="2" /></g>
        <g className="text-mute" fill="currentColor" fontSize="10">
          <text x="88" y="52">Close</text><text x="88" y="108">Open</text>
          <text x="188" y="52">Open</text><text x="188" y="108">Close</text>
          <text x="70" y="10" textAnchor="middle">High</text><text x="70" y="148" textAnchor="middle">Low</text>
          <text x="170" y="10" textAnchor="middle">High</text><text x="170" y="148" textAnchor="middle">Low</text>
          <text x="70" y="166" textAnchor="middle">Green = went up</text><text x="170" y="166" textAnchor="middle">Red = went down</text>
        </g>
      </svg>
      <p className="mt-2 text-sm text-mute">The thin line shows the highest and lowest price. The thick body shows where it opened and closed.</p>
    </div>
  );
}

export function Quiz({ step, onOk }) {
  const [sel, setSel] = useState(null);
  const right = sel === step.answer;
  return (
    <div>
      <p className="font-semibold">{step.q}</p>
      <div className="mt-3 space-y-2">
        {step.options.map((o, j) => (
          <button key={o} onClick={() => { setSel(j); if (j === step.answer) onOk(); }}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${sel === j ? (right ? 'border-profit bg-profit/15' : 'border-loss bg-loss/15') : 'border-line hover:border-primary'}`}>
            {o}
          </button>
        ))}
      </div>
      {sel !== null && <p className={`mt-3 text-sm ${right ? 'text-profit' : 'text-loss'}`}>{right ? `✅ ${step.why}` : 'Not quite. Try another answer.'}</p>}
    </div>
  );
}

function Slider({ label, text, ...props }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 flex justify-between text-mute"><span>{label}</span><b className="num text-ink">{text}</b></span>
      <input type="range" className="w-full accent-[#3B82F6]" {...props} />
    </label>
  );
}

// Monthly investing (SIP) calculator: shows how time multiplies money.
export function Compound() {
  const [m, setM] = useState(5000);
  const [y, setY] = useState(15);
  const [r, setR] = useState(12);
  const i = r / 1200, n = y * 12;
  const invested = m * n;
  const value = i ? m * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : invested;
  return (
    <div className="space-y-4">
      <Slider label="Invest every month" text={inr(m, 0)} min={500} max={50000} step={500} value={m} onChange={(e) => setM(+e.target.value)} />
      <Slider label="For how many years" text={`${y} years`} min={1} max={30} step={1} value={y} onChange={(e) => setY(+e.target.value)} />
      <Slider label="Yearly growth (example)" text={`${r}%`} min={4} max={18} step={1} value={r} onChange={(e) => setR(+e.target.value)} />
      <div className="space-y-2 text-sm">
        <div><div className="mb-1 flex justify-between"><span className="text-mute">You put in</span><span className="num">{inr(invested, 0)}</span></div>
          <div className="h-3 rounded-full bg-line/40"><div className="h-3 rounded-full bg-primary/70" style={{ width: `${(invested / value) * 100}%` }} /></div></div>
        <div><div className="mb-1 flex justify-between"><span className="text-mute">It could become</span><span className="num font-semibold text-profit">{inr(value, 0)}</span></div>
          <div className="h-3 rounded-full bg-gradient-to-r from-primary to-accent" /></div>
      </div>
      <p className="text-xs text-mute">Example only. Real returns vary and can be negative.</p>
    </div>
  );
}
