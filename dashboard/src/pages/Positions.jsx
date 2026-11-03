import { Badge, Button } from '../components/ui';
import DataTable from '../components/dashboard/DataTable';
import LivePrice from '../components/dashboard/LivePrice';
import StatCard from '../components/dashboard/StatCard';
import { Change } from '../components/dashboard/Change';
import usePortfolio from '../hooks/usePortfolio';
import { useTrading } from '../context/TradingContext';
import { inr } from '../utils/format';

export default function Positions() {
  const { positions, totals } = usePortfolio();
  const { openOrder } = useTrading();

  const columns = [
    { key: 'symbol', label: 'Instrument', render: (r) => (<div><p className="font-semibold">{r.symbol}</p><p className="text-xs text-mute">{r.name}</p></div>) },
    { key: 'product', label: 'Product', render: (r) => <Badge tone="info">{r.product}</Badge> },
    { key: 'qty', label: 'Qty', align: 'right', render: (r) => <span className="num">{r.qty}</span> },
    { key: 'avg', label: 'Avg price', align: 'right', render: (r) => <span className="num">{inr(r.avg)}</span> },
    { key: 'ltp', label: 'LTP', align: 'right', render: (r) => <LivePrice value={r.ltp} /> },
    { key: 'pnl', label: 'P&L', align: 'right', render: (r) => (<div><Change value={r.pnl} /><p className="text-xs"><Change value={r.pnlPct} kind="pct" /></p></div>) },
    { key: 'actions', label: '', sortable: false, align: 'right', render: (r) => (
      <Button size="sm" variant="outline" onClick={() => openOrder(r.symbol, 'SELL')}>Exit</Button>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <StatCard label="Open positions" value={positions.length} />
        <StatCard label="Positions P&L" value={<Change value={totals.positionsPnl} />} />
      </div>
      <DataTable columns={columns} rows={positions} rowKey="symbol" />
      <p className="text-sm text-mute">Positions are trades opened today. MIS means intraday: it should be closed before the market ends.</p>
    </div>
  );
}
