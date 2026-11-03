import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { instruments, indices } from '../data/mockData';

// Shared "live" prices + the order window state, available to every page.
// Prices here are simulated: every 2 seconds each price moves a tiny random amount.
const TradingContext = createContext(null);

export function TradingProvider({ children }) {
  const [quotes, setQuotes] = useState(() =>
    Object.fromEntries([...instruments, ...indices].map((i) => [i.symbol, i.price]))
  );
  const [order, setOrder] = useState(null); // null = window closed, else { symbol, side }

  useEffect(() => {
    const id = setInterval(() => {
      setQuotes((q) => {
        const next = {};
        for (const symbol in q) next[symbol] = +(q[symbol] * (1 + (Math.random() - 0.5) * 0.0016)).toFixed(2);
        return next;
      });
    }, 2000);
    return () => clearInterval(id); // stop the timer when the app closes
  }, []);

  const value = useMemo(
    () => ({
      quotes,
      order,
      openOrder: (symbol, side = 'BUY') => setOrder({ symbol, side }),
      closeOrder: () => setOrder(null),
    }),
    [quotes, order]
  );

  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
}

export const useTrading = () => useContext(TradingContext);
