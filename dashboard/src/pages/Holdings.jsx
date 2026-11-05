import { Link } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import DataTable from '../components/dashboard/DataTable';
import LivePrice from '../components/dashboard/LivePrice';
import StatCard from '../components/dashboard/StatCard';
import { Change } from '../components/dashboard/Change';
import usePortfolio from '../hooks/usePortfolio';
import { useTrading } from '../context/TradingContext';
import { inr } from '../utils/format';

export default function Holdings() {
  const { holdings, totals } = usePortfolio();
  const { openOrder, openStockDetail } = useTrading();
  const hasHoldings = holdings && holdings.length > 0;

  const columns = [
    {
      key: 'symbol',
      label: 'Instrument',
      render: (r) => (
        <button
          onClick={() => openStockDetail?.(r.symbol)}
          className="text-left hover:opacity-80 transition cursor-pointer"
          title="View stock details and chart"
        >
          <p className="font-semibold text-ink underline decoration-line/60 underline-offset-2">{r.symbol}</p>
          <p className="text-xs text-mute">{r.name}</p>
        </button>
      ),
    },
    { key: 'qty', label: 'Qty', align: 'right', render: (r) => <span className="num">{r.qty}</span> },
    { key: 'avg', label: 'Avg cost', align: 'right', render: (r) => <span className="num">{inr(r.avg)}</span> },
    { key: 'ltp', label: 'LTP', align: 'right', render: (r) => <LivePrice value={r.ltp} /> },
    { key: 'value', label: 'Current value', align: 'right', render: (r) => <span className="num">{inr(r.value)}</span> },
    { key: 'pnl', label: 'P&L', align: 'right', render: (r) => (<div><Change value={r.pnl} /><p className="text-xs"><Change value={r.pnlPct} kind="pct" /></p></div>) },
    { key: 'dayPct', label: 'Day', align: 'right', render: (r) => <Change value={r.dayPct} kind="pct" /> },
    { key: 'actions', label: '', sortable: false, align: 'right', render: (r) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" onClick={() => openOrder(r.symbol, 'BUY')}>Buy</Button>
        <Button size="sm" variant="outline" onClick={() => openOrder(r.symbol, 'SELL')}>Sell</Button>
      </div>
    ) },
  ];

  const footer = (
    <>
      <td className="px-4 py-3">Total</td><td /><td />
      <td />
      <td className="num px-4 py-3 text-right">{inr(totals.value || 0)}</td>
      <td className="px-4 py-3 text-right"><Change value={totals.pnl || 0} /></td>
      <td /><td />
    </>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Invested" value={inr(totals.invested || 0)} />
        <StatCard label="Current value" value={inr(totals.value || 0)} />
        <StatCard label="Total P&L" value={<Change value={totals.pnl || 0} />}>
          <Change value={totals.pnlPct || 0} kind="pct" />
        </StatCard>
      </div>

      {!hasHoldings ? (
        <Card className="p-8 text-center sm:p-12">
          <p className="font-serif text-xl">You have no holdings yet.</p>
          <p className="mt-2 text-sm text-mute">
            Buy your first stock from the watchlist to start building your portfolio.
          </p>
          <div className="mt-5 flex justify-center">
            <Link to="/watchlist">
              <Button size="sm">Go to Watchlist</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <DataTable columns={columns} rows={holdings} rowKey="symbol" footer={footer} />
      )}
    </div>
  );
}
