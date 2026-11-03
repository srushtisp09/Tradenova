import { useMemo, useState } from 'react';
import { Button, Input } from '../components/ui';
import Sparkline from '../components/dashboard/Sparkline';
import LivePrice from '../components/dashboard/LivePrice';
import { Change } from '../components/dashboard/Change';
import { useTrading } from '../context/TradingContext';
import { instruments, bySymbol, initialWatchlist } from '../data/mockData';
import { hash, seeded } from '../utils/seeded';

// Makes a small fake price history for the sparkline, the same every time for the same stock.
function makeSeries(symbol) {
  const { prev, price } = bySymbol[symbol];
  const rand = seeded(hash(symbol));
  const n = 24;
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return prev + (price - prev) * t + (rand() - 0.5) * prev * 0.006;
  });
}

function Row({ symbol, onRemove }) {
  const { quotes, openOrder } = useTrading();
  const info = bySymbol[symbol];
  const ltp = quotes[symbol];
  const base = useMemo(() => makeSeries(symbol), [symbol]);
  const series = [...base.slice(0, -1), ltp]; // last point follows the live price
  const change = ((ltp - info.prev) / info.prev) * 100;

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line/50 px-4 py-3.5 last:border-0">
      <div className="min-w-0 flex-1 basis-40">
        <p className="font-semibold">{symbol}</p>
        <p className="truncate text-xs text-mute">{info.name}</p>
      </div>
      <Sparkline data={series} up={change >= 0} />
      <div className="w-28 text-right">
        <LivePrice value={ltp} />
        <p className="text-xs"><Change value={change} kind="pct" /></p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => openOrder(symbol, 'BUY')}>Buy</Button>
        <Button size="sm" variant="outline" onClick={() => openOrder(symbol, 'SELL')}>Sell</Button>
        <button onClick={() => onRemove(symbol)} aria-label={`Remove ${symbol} from watchlist`} className="rounded-lg px-2 py-1 text-mute hover:text-loss">×</button>
      </div>
    </li>
  );
}

export default function Watchlist() {
  const [list, setList] = useState(initialWatchlist);
  const [query, setQuery] = useState('');
  const [toAdd, setToAdd] = useState('');

  const available = instruments.filter((i) => !list.includes(i.symbol));
  const shown = list.filter((s) => (s + bySymbol[s].name).toLowerCase().includes(query.toLowerCase()));

  const add = () => {
    if (!toAdd) return;
    setList([...list, toAdd]);
    setToAdd('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-48 flex-1">
          <Input id="wl-search" label="Search your watchlist" placeholder="Type a name, like TCS" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <label className="text-sm">
          <span className="mb-1.5 block text-mute">Add a stock</span>
          <div className="flex gap-2">
            <select value={toAdd} onChange={(e) => setToAdd(e.target.value)}
              className="rounded-xl border border-line bg-bg/60 px-4 py-2.5 text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Choose…</option>
              {available.map((i) => <option key={i.symbol} value={i.symbol}>{i.symbol}</option>)}
            </select>
            <Button variant="outline" onClick={add} disabled={!toAdd}>Add</Button>
          </div>
        </label>
      </div>

      <div className="glass">
        {shown.length === 0 ? (
          <p className="px-4 py-10 text-center text-mute">{list.length === 0 ? 'Your watchlist is empty. Add a stock above.' : 'No stock matches that search.'}</p>
        ) : (
          <ul>{shown.map((s) => <Row key={s} symbol={s} onRemove={(sym) => setList(list.filter((x) => x !== sym))} />)}</ul>
        )}
      </div>
    </div>
  );
}
