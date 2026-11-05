import { Link } from 'react-router-dom';
import { Badge, Button, Card } from '../components/ui';
import StatCard from '../components/dashboard/StatCard';
import { Change } from '../components/dashboard/Change';
import usePortfolio from '../hooks/usePortfolio';
import { useTrading } from '../context/TradingContext';
import { instruments } from '../data/mockData';
import { sectorOf } from '../data/sectors';
import { inr } from '../utils/format';

const LEVELS = { 3: ['High', 'loss'], 2: ['Medium', 'info'], 1: ['Low', 'neutral'] };

export default function Insights() {
  const { holdings = [], positions = [], totals = {} } = usePortfolio();
  const { quotes, openOrder, openStockDetail } = useTrading();
  const hasHoldings = holdings && holdings.length > 0;

  // Market pulse: how every demo stock moved versus yesterday
  const moves = instruments
    .map((i) => {
      const ltp = quotes[i.symbol] ?? i.price;
      const prev = i.prev || ltp;
      const pct = prev > 0 ? ((ltp - prev) / prev) * 100 : 0;
      return { ...i, ltp, pct };
    })
    .sort((a, b) => b.pct - a.pct);

  const up = moves.filter((m) => m.pct >= 0).length;
  const gainers = moves.slice(0, 3);
  const losers = moves.slice(-3).reverse();

  // Sector breakdown safe against empty holdings
  const bySector = {};
  holdings.forEach((h) => {
    const s = sectorOf(h.symbol);
    bySector[s] = (bySector[s] || 0) + (h.value || 0);
  });
  const holdingsValue = totals.value || 0;
  const sectors = Object.entries(bySector)
    .map(([name, v]) => ({
      name,
      w: holdingsValue > 0 ? (v / holdingsValue) * 100 : 0,
    }))
    .sort((a, b) => b.w - a.w);

  const biggest = [...holdings].sort((a, b) => (b.value || 0) - (a.value || 0))[0] || null;
  const netWorth = totals.netWorth || 0;
  const cash = totals.cash || 0;
  const cashPct = netWorth > 0 ? (cash / netWorth) * 100 : 100;

  // "What to change": checks and recommendations
  const tips = [];
  if (hasHoldings) {
    holdings.forEach((h) => {
      const w = holdingsValue > 0 ? (h.value / holdingsValue) * 100 : 0;
      if (w > 18) {
        tips.push({
          id: 'big' + h.symbol,
          level: 2,
          title: `Trim ${h.symbol}?`,
          text: `${h.symbol} is ${w.toFixed(0)}% of your holdings. Many traders keep one stock under 15 to 20%.`,
          sell: h.symbol,
        });
      }
      if (h.pnlPct < -3) {
        tips.push({
          id: 'loss' + h.symbol,
          level: 3,
          title: `Review ${h.symbol}`,
          text: `Down ${Math.abs(h.pnlPct).toFixed(1)}% from your cost. Decide now: a stop-loss, or a clear reason to hold.`,
          sell: h.symbol,
        });
      }
      if (h.pnlPct > 20) {
        tips.push({
          id: 'win' + h.symbol,
          level: 1,
          title: `Book some profit in ${h.symbol}?`,
          text: `Up ${h.pnlPct.toFixed(1)}%. Selling a part locks in gains and lowers risk.`,
          sell: h.symbol,
        });
      }
    });

    if (sectors[0]?.w > 35) {
      tips.push({
        id: 'sector',
        level: 2,
        title: `Too much in ${sectors[0].name}`,
        text: `${sectors[0].name} is ${sectors[0].w.toFixed(0)}% of your holdings. One bad quarter for the sector would hit hard. Spread into other sectors.`,
        to: '/watchlist',
        toLabel: 'Find ideas',
      });
    }
  }

  if (cashPct > 50) {
    tips.push({
      id: 'cash',
      level: 1,
      title: 'Lots of idle cash',
      text: `Cash is ${cashPct.toFixed(0)}% of your net worth. Plan your entries, or keep it on purpose as a reserve.`,
      to: '/watchlist',
      toLabel: 'Open watchlist',
    });
  }

  if (positions.length > 0) {
    tips.push({
      id: 'mis',
      level: 2,
      title: 'Close intraday positions',
      text: `${positions.length} intraday (MIS) positions are open. Exit them before the market closes to avoid auto square-off.`,
      to: '/positions',
      toLabel: 'View positions',
    });
  }

  tips.sort((a, b) => b.level - a.level);

  const Movers = ({ title, list }) => (
    <Card>
      <h3 className="mb-3 font-semibold">{title}</h3>
      <ul className="space-y-1">
        {list.map((m) => (
          <li key={m.symbol}>
            <button
              onClick={() => openStockDetail ? openStockDetail(m.symbol) : openOrder(m.symbol, 'BUY')}
              className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-line/30 cursor-pointer"
              title="Click to view real chart and trade"
            >
              <span>
                <b className="underline decoration-line/60 underline-offset-2">{m.symbol}</b> <span className="num ml-2 text-sm text-mute">{inr(m.ltp)}</span>
              </span>
              <Change value={m.pct} kind="pct" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Market breadth" value={`${up} up · ${moves.length - up} down`}>
          <div className="flex h-2 overflow-hidden rounded-full bg-loss/40">
            <div className="bg-profit" style={{ width: `${(up / moves.length) * 100}%` }} />
          </div>
        </StatCard>
        <StatCard
          label="Largest holding"
          value={biggest ? biggest.symbol : 'None'}
        >
          <span className="text-mute">
            {biggest && holdingsValue > 0
              ? `${((biggest.value / holdingsValue) * 100).toFixed(1)}% of holdings`
              : 'No holdings yet'}
          </span>
        </StatCard>
        <StatCard label="Idle cash" value={`${cashPct.toFixed(0)}%`}>
          <span className="text-mute">of net worth</span>
        </StatCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Movers title="📈 Top gainers" list={gainers} />
        <Movers title="📉 Top losers" list={losers} />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 font-semibold">Sector exposure</h3>
          {!hasHoldings ? (
            <p className="text-sm text-mute">No sector exposure yet. Holdings will appear here.</p>
          ) : (
            <ul className="space-y-3 text-sm">
              {sectors.map((s) => (
                <li key={s.name}>
                  <div className="mb-1 flex justify-between">
                    <span>{s.name}</span>
                    <span className={`num ${s.w > 35 ? 'text-loss' : 'text-mute'}`}>{s.w.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-line/40">
                    <div
                      className={`h-2 rounded-full ${s.w > 35 ? 'bg-loss' : 'bg-gradient-to-r from-primary to-accent'}`}
                      style={{ width: `${s.w}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="lg:col-span-3">
          <h3 className="mb-4 font-semibold">What to change</h3>
          {tips.length === 0 ? (
            <p className="text-mute">Your portfolio looks balanced against these checks. Nice.</p>
          ) : (
            <ul className="space-y-3">
              {tips.map((t) => (
                <li key={t.id} className="rounded-xl border border-line/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold">{t.title}</p>
                    <Badge tone={LEVELS[t.level][1]}>{LEVELS[t.level][0]}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-mute">{t.text}</p>
                  <div className="mt-3">
                    {t.sell && (
                      <Button size="sm" variant="outline" onClick={() => openOrder(t.sell, 'SELL')}>
                        Sell some
                      </Button>
                    )}
                    {t.to && (
                      <Link to={t.to}>
                        <Button size="sm" variant="outline">
                          {t.toLabel}
                        </Button>
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-mute">Rules of thumb on demo data. Educational only, not investment advice.</p>
        </Card>
      </div>
    </div>
  );
}
