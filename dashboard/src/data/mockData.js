import { seeded } from '../utils/seeded';

// DEMO DATA. In Step 6 this file is replaced by real data from our backend.
// price = last traded price, prev = yesterday's closing price.
export const instruments = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2918.4, prev: 2884.1 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', price: 4102.15, prev: 4119.0 },
  { symbol: 'INFY', name: 'Infosys', price: 1874.6, prev: 1859.8 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1652.3, prev: 1655.6 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1248.75, prev: 1241.3 },
  { symbol: 'SBIN', name: 'State Bank of India', price: 812.9, prev: 800.9 },
  { symbol: 'ITC', name: 'ITC Ltd', price: 468.25, prev: 471.5 },
  { symbol: 'WIPRO', name: 'Wipro', price: 552.1, prev: 550.45 },
  { symbol: 'LT', name: 'Larsen & Toubro', price: 3640.85, prev: 3608.4 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1582.2, prev: 1570.1 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', price: 968.4, prev: 975.2 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 2415.5, prev: 2432.8 },
];

export const indices = [
  { symbol: 'NIFTY', name: 'NIFTY 50', price: 24520.35, prev: 24410.1 },
  { symbol: 'SENSEX', name: 'SENSEX', price: 80650.2, prev: 80290.55 },
];

// One lookup table for everything: bySymbol.TCS -> { symbol, name, price, prev }
export const bySymbol = Object.fromEntries([...instruments, ...indices].map((i) => [i.symbol, i]));

export const startingCash = 1000000;

// What the user owns for the long term (delivery)
export const holdings = [
  { symbol: 'RELIANCE', qty: 25, avg: 2610.5 },
  { symbol: 'TCS', qty: 10, avg: 3820.0 },
  { symbol: 'INFY', qty: 40, avg: 1690.25 },
  { symbol: 'HDFCBANK', qty: 30, avg: 1710.8 },
  { symbol: 'ITC', qty: 100, avg: 395.6 },
  { symbol: 'SBIN', qty: 60, avg: 640.1 },
  { symbol: 'WIPRO', qty: 50, avg: 585.0 },
  { symbol: 'LT', qty: 8, avg: 3320.0 },
];

// Trades opened today (intraday)
export const positions = [
  { symbol: 'ICICIBANK', product: 'MIS', qty: 50, avg: 1243.1 },
  { symbol: 'TATAMOTORS', product: 'MIS', qty: 80, avg: 972.0 },
  { symbol: 'BHARTIARTL', product: 'MIS', qty: 20, avg: 1576.4 },
];

export const initialWatchlist = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'SBIN', 'LT'];

// Cash left after buying the holdings above
export const cash = startingCash - holdings.reduce((s, h) => s + h.qty * h.avg, 0);

// 30 days of portfolio value, from the starting cash up to today's value.
const todayValue = cash + holdings.reduce((s, h) => s + h.qty * bySymbol[h.symbol].price, 0);
const rand = seeded(42);
export const historyLength = 30;
export const portfolioHistory = Array.from({ length: historyLength }, (_, i) => {
  const t = i / (historyLength - 1);
  const noise = (rand() - 0.5) * startingCash * 0.012;
  const v = startingCash + (todayValue - startingCash) * t + (i === 0 || i === historyLength - 1 ? 0 : noise);
  return Math.round(v);
});

export const historyLabels = Array.from({ length: historyLength }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (historyLength - 1 - i));
  return i === historyLength - 1 ? 'Today' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
});
