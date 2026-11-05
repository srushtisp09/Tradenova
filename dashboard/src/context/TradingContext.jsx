import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { instruments as fallbackInstruments, indices as fallbackIndices, bySymbol as fallbackBySymbol } from '../data/mockData';
import api from '../services/api';

// Shared live prices + order modal state, backed by our REST API.
const TradingContext = createContext(null);

export function TradingProvider({ children }) {
  const [instrumentsList, setInstrumentsList] = useState([...fallbackInstruments, ...fallbackIndices]);
  const [quotes, setQuotes] = useState(() =>
    Object.fromEntries([...fallbackInstruments, ...fallbackIndices].map((i) => [i.symbol, i.price]))
  );
  const [quoteSource, setQuoteSource] = useState('simulated'); // 'live' | 'simulated'
  const [updatedAt, setUpdatedAt] = useState(null);
  const [order, setOrder] = useState(null); // null = window closed, else { symbol, side }
  const [selectedStock, setSelectedStock] = useState(null); // stock detail modal state

  const loadInstruments = useCallback(async () => {
    try {
      const data = await api.getInstruments();
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map((item) => ({
          symbol: item.symbol,
          name: item.name,
          price: item.price ?? item.lastPrice,
          prev: item.prevClose,
          sector: item.sector,
          isIndex: item.isIndex,
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

  // Poll GET /api/quotes every 10 seconds, pausing when document is hidden
  const fetchLiveQuotes = useCallback(async () => {
    if (typeof document !== 'undefined' && document.hidden) return;
    try {
      const res = await api.getQuotes();
      if (res && res.quotes) {
        setQuoteSource(res.source || 'simulated');
        setUpdatedAt(res.updatedAt || new Date().toISOString());
        setQuotes((prev) => {
          const next = { ...prev };
          for (const [sym, q] of Object.entries(res.quotes)) {
            if (q && q.price !== undefined) {
              next[sym] = q.price;
            }
          }
          return next;
        });
      }
    } catch (err) {
      console.warn('[TradingContext] Failed to fetch quotes:', err.message);
      setQuoteSource('simulated');
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchLiveQuotes();

    const intervalId = setInterval(fetchLiveQuotes, 10000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchLiveQuotes();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchLiveQuotes]);

  // Small random movement every 2s ONLY if quoteSource is "simulated"
  useEffect(() => {
    if (quoteSource === 'live') return;

    const id = setInterval(() => {
      setQuotes((q) => {
        const next = {};
        for (const symbol in q) {
          next[symbol] = +(q[symbol] * (1 + (Math.random() - 0.5) * 0.0016)).toFixed(2);
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [quoteSource]);

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
      quoteSource,
      updatedAt,
      instruments: instrumentsList,
      bySymbol: instrumentsMap,
      order,
      openOrder: (symbol, side = 'BUY') => setOrder({ symbol, side }),
      closeOrder: () => setOrder(null),
      selectedStock,
      openStockDetail: (symbol) => setSelectedStock(symbol),
      closeStockDetail: () => setSelectedStock(null),
      refreshInstruments: loadInstruments,
    }),
    [quotes, quoteSource, updatedAt, instrumentsList, instrumentsMap, order, selectedStock, loadInstruments]
  );

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
}

export const useTrading = () => useContext(TradingContext);

