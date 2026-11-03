import { useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { holdings, positions, bySymbol, cash } from '../data/mockData';

// Combines our holdings + live prices and does all the profit/loss maths in ONE place.
export default function usePortfolio() {
  const { quotes } = useTrading();

  return useMemo(() => {
    const h = holdings.map((x) => {
      const info = bySymbol[x.symbol];
      const ltp = quotes[x.symbol];
      const invested = x.qty * x.avg;
      const value = x.qty * ltp;
      return {
        ...x, name: info.name, ltp, invested, value,
        pnl: value - invested,
        pnlPct: ((value - invested) / invested) * 100,
        dayChange: (ltp - info.prev) * x.qty,
        dayPct: ((ltp - info.prev) / info.prev) * 100,
      };
    });

    const p = positions.map((x) => {
      const info = bySymbol[x.symbol];
      const ltp = quotes[x.symbol];
      return {
        ...x, name: info.name, ltp,
        pnl: (ltp - x.avg) * x.qty,
        pnlPct: ((ltp - x.avg) / x.avg) * 100,
      };
    });

    const sum = (list, key) => list.reduce((s, r) => s + r[key], 0);
    const invested = sum(h, 'invested');
    const value = sum(h, 'value');
    const pnl = value - invested;

    return {
      holdings: h,
      positions: p,
      totals: {
        invested, value, pnl,
        pnlPct: (pnl / invested) * 100,
        dayPnl: sum(h, 'dayChange') + sum(p, 'pnl'),
        positionsPnl: sum(p, 'pnl'),
        cash,
        netWorth: cash + value,
      },
    };
  }, [quotes]);
}
