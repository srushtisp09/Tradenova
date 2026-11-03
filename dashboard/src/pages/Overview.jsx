import { Card } from '../components/ui';
import StatCard from '../components/dashboard/StatCard';
import AreaChart from '../components/dashboard/AreaChart';
import { Change } from '../components/dashboard/Change';
import usePortfolio from '../hooks/usePortfolio';
import { portfolioHistory, historyLabels } from '../data/mockData';
import { inr } from '../utils/format';

const colors = ['#3B82F6', '#6366F1', '#8B5CF6', '#A78BFA', '#38BDF8', '#64748B'];

export default function Overview() {
  const { holdings, totals } = usePortfolio();

  // History from the past, with today's live value added at the end
  const series = [...portfolioHistory.slice(0, -1), Math.round(totals.netWorth)];

  // Share of each holding in the portfolio (top 5 + "Others")
  const sorted = [...holdings].sort((a, b) => b.value - a.value);
  const top = sorted.slice(0, 5).map((h) => ({ label: h.symbol, value: h.value }));
  const others = sorted.slice(5).reduce((s, h) => s + h.value, 0);
  const slices = others > 0 ? [...top, { label: 'Others', value: others }] : top;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Net worth" value={inr(totals.netWorth)}>
          <span className="text-mute">Cash {inr(totals.cash, 0)}</span>
        </StatCard>
        <StatCard label="Holdings value" value={inr(totals.value)}>
          <span className="text-mute">Invested {inr(totals.invested, 0)}</span>
        </StatCard>
        <StatCard label="Total P&L" value={<Change value={totals.pnl} />}>
          <Change value={totals.pnlPct} kind="pct" />
        </StatCard>
        <StatCard label="Today's P&L" value={<Change value={totals.dayPnl} />}>
          <span className="text-mute">Holdings and positions</span>
        </StatCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">Portfolio growth · 30 days</h2>
          <AreaChart data={series} labels={historyLabels} />
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold">Where your money is</h2>
          <div className="flex h-3 overflow-hidden rounded-full bg-line/40" role="img" aria-label="Portfolio allocation">
            {slices.map((s, i) => (
              <div key={s.label} style={{ width: `${(s.value / totals.value) * 100}%`, background: colors[i] }} />
            ))}
          </div>
          <ul className="mt-5 space-y-2.5 text-sm">
            {slices.map((s, i) => (
              <li key={s.label} className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[i] }} />
                  {s.label}
                </span>
                <span className="num text-mute">{((s.value / totals.value) * 100).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
