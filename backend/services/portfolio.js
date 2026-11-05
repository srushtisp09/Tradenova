import Holding from '../models/Holding.js';
import Position from '../models/Position.js';
import Instrument from '../models/Instrument.js';

// All the profit and loss maths in one place. The dashboard used to do this in the browser.
// Field names match the dashboard, so connecting it in Step 6 is easy.
export async function buildPortfolio(user) {
  const [holdingDocs, positionDocs] = await Promise.all([
    Holding.find({ user: user._id }).lean(),
    Position.find({ user: user._id }).lean(),
  ]);
  const symbols = [...new Set([...holdingDocs, ...positionDocs].map((x) => x.symbol))];
  const found = await Instrument.find({ symbol: { $in: symbols } }).lean();
  const info = Object.fromEntries(found.map((i) => [i.symbol, i]));

  const holdings = holdingDocs.map((x) => {
    const i = info[x.symbol];
    const ltp = i?.price ?? x.avgPrice;
    const prev = i?.prevClose ?? ltp;
    const invested = x.qty * x.avgPrice;
    const value = x.qty * ltp;
    return {
      symbol: x.symbol, name: i?.name ?? x.symbol, sector: i?.sector ?? 'Other',
      qty: x.qty, avg: x.avgPrice, ltp, invested, value,
      pnl: value - invested, pnlPct: invested ? ((value - invested) / invested) * 100 : 0,
      dayChange: (ltp - prev) * x.qty, dayPct: prev ? ((ltp - prev) / prev) * 100 : 0,
    };
  });

  const positions = positionDocs.map((x) => {
    const i = info[x.symbol];
    const ltp = i?.price ?? x.avgPrice;
    return {
      symbol: x.symbol, name: i?.name ?? x.symbol, product: x.product, qty: x.qty, avg: x.avgPrice, ltp,
      value: x.qty * ltp, pnl: (ltp - x.avgPrice) * x.qty, pnlPct: x.avgPrice ? ((ltp - x.avgPrice) / x.avgPrice) * 100 : 0,
    };
  });

  const sum = (list, key) => list.reduce((s, r) => s + r[key], 0);
  const invested = sum(holdings, 'invested');
  const value = sum(holdings, 'value');
  const pnl = value - invested;
  const positionsPnl = sum(positions, 'pnl');

  return {
    holdings,
    positions,
    totals: {
      invested, value, pnl, pnlPct: invested ? (pnl / invested) * 100 : 0,
      dayPnl: sum(holdings, 'dayChange') + positionsPnl, positionsPnl,
      cash: user.cash, netWorth: user.cash + value,
    },
  };
}
