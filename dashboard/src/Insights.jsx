import { useMemo } from 'react';
import useApi from './useApi';
import { useTrading } from '../context/TradingContext';
import { getHoldings, getPositions, getPortfolio } from '../services/api';

// Holdings and positions come from the database. Prices come from the live quotes,
// so profit and loss keep moving on screen. Returns the same shape the pages already use.
export default function usePortfolio() {
  const { quotes, bySymbol } = useTrading();
  const h = useApi(getHoldings);
  const p = useApi(getPositions);
  const t = useApi(getPortfolio);

  const loading = h.loading || p.loading || t.loading;
  const error = h.error || p.error || t.error;
  const refetch = () => { h.refetch(); p.refetch(); t.refetch(); };

  const result = useMemo(() => {
    const holdings = (h.data || []).map((x) => {
      const ltp = quotes[x.symbol] ?? x.ltp;
      const prev = bySymbol[x.symbol]?.prevClose ?? ltp;
      const invested = x.qty * x.avg;
      const value = x.qty * ltp;
      return {
        ...x, ltp, invested, value,
        pnl: value - invested,
        pnlPct: invested ? ((value - invested) / invested) * 100 : 0,
        dayChange: (ltp - prev) * x.qty,
        dayPct: prev ? ((ltp - prev) / prev) * 100 : 0,
      };
    });

    const positions = (p.data || []).map((x) => {
      const ltp = quotes[x.symbol] ?? x.ltp;
      return { ...x, ltp, value: x.qty * ltp, pnl: (ltp - x.avg) * x.qty, pnlPct: x.avg ? ((ltp - x.avg) / x.avg) * 100 : 0 };
    });

    const sum = (list, key) => list.reduce((s, r) => s + r[key], 0);
    const invested = sum(holdings, 'invested');
    const value = sum(holdings, 'value');
    const pnl = value - invested;
    const positionsPnl = sum(positions, 'pnl');
    const cash = t.data?.cash ?? 0;

    return {
      holdings, positions,
      totals: {
        invested, value, pnl, pnlPct: invested ? (pnl / invested) * 100 : 0,
        dayPnl: sum(holdings, 'dayChange') + positionsPnl, positionsPnl, cash, netWorth: cash + value,
      },
    };
  }, [h.data, p.data, t.data, quotes, bySymbol]);

  return { ...result, loading, error, refetch };
}
