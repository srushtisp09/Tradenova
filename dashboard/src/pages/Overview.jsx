import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import StatCard from '../components/dashboard/StatCard';
import PortfolioGrowthChart from '../components/dashboard/PortfolioGrowthChart';
import HoldingsDoughnut from '../components/dashboard/HoldingsDoughnut';
import { Change } from '../components/dashboard/Change';
import usePortfolio from '../hooks/usePortfolio';
import api from '../services/api';
import { inr } from '../utils/format';

export default function Overview() {
  const { holdings, totals } = usePortfolio();
  const [history, setHistory] = useState([]);
  const hasHoldings = holdings && holdings.length > 0;

  // Load user's portfolio history from the backend
  useEffect(() => {
    let active = true;
    api.getPortfolioHistory()
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setHistory(data);
        }
      })
      .catch((err) => {
        console.warn('Could not load portfolio history:', err.message);
      });
    return () => {
      active = false;
    };
  }, [totals.netWorth]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Net worth" value={inr(totals.netWorth || 0)}>
          <span className="text-mute">Cash {inr(totals.cash || 0, 0)}</span>
        </StatCard>
        <StatCard label="Holdings value" value={inr(totals.value || 0)}>
          <span className="text-mute">Invested {inr(totals.invested || 0, 0)}</span>
        </StatCard>
        <StatCard label="Total P&L" value={<Change value={totals.pnl || 0} />}>
          <Change value={totals.pnlPct || 0} kind="pct" />
        </StatCard>
        <StatCard label="Today's P&L" value={<Change value={totals.dayPnl || 0} />}>
          <span className="text-mute">Holdings and positions</span>
        </StatCard>
      </div>

      {!hasHoldings ? (
        <Card className="p-8 text-center sm:p-12">
          <span className="text-4xl">🌱</span>
          <h2 className="mt-4 font-serif text-2xl">Welcome to TradeNova!</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-mute">
            You have no holdings yet. Buy your first stock from the watchlist.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/watchlist">
              <Button size="md">Explore Watchlist</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <h2 className="mb-3 font-semibold">Portfolio growth · 30 days</h2>
            <PortfolioGrowthChart snapshots={history} currentNetWorth={totals.netWorth} />
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold">Where your money is</h2>
            <HoldingsDoughnut holdings={holdings} totalValue={totals.value} />
          </Card>
        </div>
      )}
    </div>
  );
}
