import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { instruments as fallbackInstruments, indices as fallbackIndices, bySymbol as fallbackBySymbol } from '../data/mockData';
import api from '../services/api';

// Shared live prices + order modal state, backed by our REST API.
const TradingContext = createContext(null);

export function TradingProvider({ children }) {
  const [instrumentsList, setInstrumentsList] = useState([...fallbackInstruments, ...fallbackIndices]);
  const [quotes, setQuotes] = useState(() =>
    Object.fromEntries([...fallbackInstruments, ...fallbackIndices].map((i) => [i.symbol, i.price]))
  );
  const [order, setOrder] = useState(null); // null = window closed, else { symbol, side }

  const loadInstruments = useCallback(async () => {
    try {
      const data = await api.getInstruments();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((item) => ({
          symbol: item.symbol,
          name: item.name,
          price: item.lastPrice,
          prev: item.prevClose,
          high: item.high,
          low: item.low,
          volume: item.volume,
        }));
        setInstrumentsList(formatted);
        setQuotes((prev) => {
          const next = { ...prev };
          formatted.forEach((f) => {
            if (!next[f.symbol]) next[f.symbol] = f.price;
          });
          return next;
        });
      }
    } catch (err) {
      console.warn('Using fallback instruments:', err.message);
    }
  }, []);

  useEffect(() => {
    loadInstruments();
  }, [loadInstruments]);

  // Simulate tick updates every 2 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setQuotes((q) => {
        const next = {};
        for (const symbol in q) next[symbol] = +(q[symbol] * (1 + (Math.random() - 0.5) * 0.0016)).toFixed(2);
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const instrumentsMap = useMemo(() => {
    const map = { ...fallbackBySymbol };
    instrumentsList.forEach((inst) => {
      map[inst.symbol] = inst;
    });
    return map;
  }, [instrumentsList]);

  const value = useMemo(
    () => ({
      quotes,
      instruments: instrumentsList,
      bySymbol: instrumentsMap,
      order,
      openOrder: (symbol, side = 'BUY') => setOrder({ symbol, side }),
      closeOrder: () => setOrder(null),
      refreshInstruments: loadInstruments,
    }),
    [quotes, instrumentsList, instrumentsMap, order, loadInstruments]
  );

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
}

export const useTrading = () => useContext(TradingContext);

