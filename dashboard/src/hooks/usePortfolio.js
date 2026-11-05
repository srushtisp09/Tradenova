import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTrading } from '../context/TradingContext';
import { useAuth } from '../context/AuthContext';
import { bySymbol as fallbackBySymbol } from '../data/mockData';
import api from '../services/api';

// Combines backend portfolio data + live prices with real-time profit/loss calculations.
export default function usePortfolio() {
  const { quotes, bySymbol = fallbackBySymbol } = useTrading();
  const { user } = useAuth();
  const [rawHoldings, setRawHoldings] = useState([]);
  const [rawPositions, setRawPositions] = useState([]);
  const [userCash, setUserCash] = useState(1000000);
  const [loading, setLoading] = useState(true);

  const fetchPortfolioData = useCallback(async () => {
    try {
      const [hData, pData, portData] = await Promise.allSettled([
        api.getHoldings(),
        api.getPositions(),
        api.getPortfolio(),
      ]);

      if (hData.status === 'fulfilled' && Array.isArray(hData.value)) {
        setRawHoldings(
          hData.value.map((item) => ({
            symbol: item.symbol,
            qty: item.qty,
            avg: item.avgPrice ?? item.avg,
            name: item.name,
          }))
        );
      } else {
        setRawHoldings([]);
      }

      if (pData.status === 'fulfilled' && Array.isArray(pData.value)) {
        setRawPositions(
          pData.value.map((item) => ({
            symbol: item.symbol,
            product: item.product,
            qty: item.qty,
            avg: item.avgPrice ?? item.avg,
            name: item.name,
          }))
        );
      } else {
        setRawPositions([]);
      }

      if (portData.status === 'fulfilled' && portData.value?.cash !== undefined) {
        setUserCash(portData.value.cash);
      } else if (user?.cash !== undefined) {
        setUserCash(user.cash);
      }
    } catch (err) {
      console.warn('Error fetching portfolio from API:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const portfolio = useMemo(() => {
    const h = (rawHoldings || []).map((x) => {
      const info = bySymbol[x.symbol] || { name: x.name || x.symbol, prev: x.avg };
      const ltp = quotes[x.symbol] ?? x.avg;
      const invested = x.qty * x.avg;
      const value = x.qty * ltp;
      const prev = info.prev || ltp;
      return {
        ...x,
        name: info.name || x.name || x.symbol,
        ltp,
        invested,
        value,
        pnl: value - invested,
        pnlPct: invested > 0 ? ((value - invested) / invested) * 100 : 0,
        dayChange: (ltp - prev) * x.qty,
        dayPct: prev > 0 ? ((ltp - prev) / prev) * 100 : 0,
      };
    });

    const p = (rawPositions || []).map((x) => {
      const info = bySymbol[x.symbol] || { name: x.name || x.symbol, prev: x.avg };
      const ltp = quotes[x.symbol] ?? x.avg;
      return {
        ...x,
        name: info.name || x.name || x.symbol,
        ltp,
        pnl: (ltp - x.avg) * x.qty,
        pnlPct: x.avg > 0 ? ((ltp - x.avg) / x.avg) * 100 : 0,
      };
    });

    const sum = (list, key) => list.reduce((s, r) => s + (r[key] || 0), 0);
    const invested = sum(h, 'invested');
    const value = sum(h, 'value');
    const pnl = value - invested;

    return {
      holdings: h,
      positions: p,
      totals: {
        invested,
        value,
        pnl,
        pnlPct: invested > 0 ? (pnl / invested) * 100 : 0,
        dayPnl: sum(h, 'dayChange') + sum(p, 'pnl'),
        positionsPnl: sum(p, 'pnl'),
        cash: userCash,
        netWorth: userCash + value,
      },
      loading,
      refetch: fetchPortfolioData,
    };
  }, [quotes, rawHoldings, rawPositions, userCash, bySymbol, loading, fetchPortfolioData]);

  return portfolio;
}
