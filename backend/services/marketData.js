import YahooFinance from 'yahoo-finance2';
import Instrument from '../models/Instrument.js';

// Initialize the Yahoo Finance client
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// Check whether live data is enabled in the environment (default: true)
export const isLiveEnabled = () => process.env.LIVE_DATA !== 'false';

// Map our symbols to Yahoo Finance symbols
export function toYahooSymbol(symbol) {
  const s = symbol.toUpperCase().trim();
  if (s === 'NIFTY') return '^NSEI';
  if (s === 'SENSEX') return '^BSESN';
  return `${s}.NS`;
}

// In-memory cache for batch quotes (15s TTL)
let quotesCache = {
  timestamp: 0,
  data: null,
};

// In-memory cache for chart history (60s TTL per key)
const historyCache = new Map();

/**
 * Fetch batch quotes for all instruments in one call.
 * Returns: { source: "live" | "simulated", updatedAt: string, quotes: { [symbol]: { price, prevClose, marketState } } }
 */
export async function fetchQuotes() {
  const now = Date.now();
  // Return cached result if within 15 seconds
  if (quotesCache.data && (now - quotesCache.timestamp) < 15000) {
    return quotesCache.data;
  }

  // Load all instruments from database (or fallbacks)
  const instruments = await Instrument.find().lean().catch(() => []);
  const fallbackQuotes = {};
  for (const inst of instruments) {
    fallbackQuotes[inst.symbol] = {
      price: inst.price,
      prevClose: inst.prevClose,
      marketState: 'CLOSED',
    };
  }

  if (!isLiveEnabled()) {
    const result = {
      source: 'simulated',
      updatedAt: new Date().toISOString(),
      quotes: fallbackQuotes,
    };
    quotesCache = { timestamp: now, data: result };
    return result;
  }

  try {
    const symbolMap = {}; // yahooSymbol -> ourSymbol
    const yahooSymbols = [];

    for (const inst of instruments) {
      const ySym = toYahooSymbol(inst.symbol);
      symbolMap[ySym] = inst.symbol;
      yahooSymbols.push(ySym);
    }

    if (yahooSymbols.length === 0) {
      return { source: 'simulated', updatedAt: new Date().toISOString(), quotes: {} };
    }

    // Single batch call to Yahoo Finance
    const rawQuotes = await yahooFinance.quote(yahooSymbols);
    const quotes = { ...fallbackQuotes };
    const bulkOps = [];
    const receivedSymbols = new Set();

    if (Array.isArray(rawQuotes)) {
      for (const item of rawQuotes) {
        if (!item || !item.symbol) continue;
        const ourSymbol = symbolMap[item.symbol];
        if (!ourSymbol) continue;

        receivedSymbols.add(ourSymbol);

        const price = item.regularMarketPrice ?? quotes[ourSymbol]?.price;
        const prevClose = item.regularMarketPreviousClose ?? quotes[ourSymbol]?.prevClose ?? price;
        const marketState = item.marketState || 'REGULAR';

        if (price !== undefined && price !== null) {
          quotes[ourSymbol] = { price, prevClose, marketState };
          bulkOps.push({
            updateOne: {
              filter: { symbol: ourSymbol },
              update: { $set: { price, prevClose } },
            },
          });
        }
      }
    }

    // Check if any symbols failed / missing
    for (const inst of instruments) {
      if (!receivedSymbols.has(inst.symbol)) {
        console.warn(`[marketData] Missing live quote for ${inst.symbol}, kept stored price: ${inst.price}`);
      }
    }

    // Update prices in MongoDB using ONE bulkWrite
    if (bulkOps.length > 0) {
      Instrument.bulkWrite(bulkOps).catch((err) => {
        console.warn('[marketData] bulkWrite update failed:', err.message);
      });
    }

    const result = {
      source: 'live',
      updatedAt: new Date().toISOString(),
      quotes,
    };
    quotesCache = { timestamp: now, data: result };
    return result;
  } catch (err) {
    console.warn(`[marketData] Yahoo batch fetch failed: ${err.message}. Falling back to simulated prices.`);
    const result = {
      source: 'simulated',
      updatedAt: new Date().toISOString(),
      quotes: fallbackQuotes,
    };
    quotesCache = { timestamp: now, data: result };
    return result;
  }
}

/**
 * Get historical price chart candles for a symbol.
 * Valid ranges: 1d, 5d, 1mo, 6mo, 1y.
 * Returns: [{ t: ISOString, o, h, l, c, v }]
 */
export async function getHistory(symbol, range = '1mo') {
  const normSymbol = symbol.toUpperCase().trim();
  const cacheKey = `${normSymbol}:${range}`;
  const cached = historyCache.get(cacheKey);

  if (cached && (Date.now() - cached.timestamp) < 60000) {
    return cached.data;
  }

  const ySymbol = toYahooSymbol(normSymbol);

  // Range and interval mapping
  const now = new Date();
  let period1;
  let interval = '1d';

  switch (range) {
    case '1d':
      period1 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      interval = '5m';
      break;
    case '5d':
      period1 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      interval = '15m';
      break;
    case '1mo':
      period1 = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
      interval = '1d';
      break;
    case '6mo':
      period1 = new Date(now.getTime() - 182 * 24 * 60 * 60 * 1000);
      interval = '1d';
      break;
    case '1y':
      period1 = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      interval = '1wk';
      break;
    default:
      period1 = new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000);
      interval = '1d';
  }

  try {
    const res = await yahooFinance.chart(ySymbol, { period1, interval });
    const rawQuotes = res?.quotes || [];
    const formatted = rawQuotes
      .filter((q) => q && q.date && (q.close !== null && q.close !== undefined))
      .map((q) => ({
        t: new Date(q.date).toISOString(),
        o: Number((q.open ?? q.close).toFixed(2)),
        h: Number((q.high ?? q.close).toFixed(2)),
        l: Number((q.low ?? q.close).toFixed(2)),
        c: Number(q.close.toFixed(2)),
        v: q.volume || 0,
      }));

    if (formatted.length === 0) {
      throw new Error(`No chart data returned for ${normSymbol}`);
    }

    historyCache.set(cacheKey, { timestamp: Date.now(), data: formatted });
    return formatted;
  } catch (err) {
    console.warn(`[marketData] Chart fetch failed for ${normSymbol} (${range}): ${err.message}. Generating fallback.`);
    // Generate fallback series using stored instrument price
    const inst = await Instrument.findOne({ symbol: normSymbol }).lean().catch(() => null);
    const basePrice = inst?.price || 1000;
    const fallback = generateFallbackHistory(basePrice, range);
    historyCache.set(cacheKey, { timestamp: Date.now(), data: fallback });
    return fallback;
  }
}

// Generate simple fallback historical data if Yahoo fails
function generateFallbackHistory(basePrice, range) {
  const points = range === '1d' ? 30 : range === '5d' ? 35 : range === '1mo' ? 24 : range === '6mo' ? 26 : 52;
  const now = Date.now();
  const stepMs = (range === '1d' ? 24 * 60 * 60 * 1000 : range === '5d' ? 7 * 24 * 60 * 60 * 1000 : range === '1mo' ? 30 * 24 * 60 * 60 * 1000 : range === '6mo' ? 180 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000) / points;

  let cur = basePrice * 0.95;
  const list = [];
  for (let i = 0; i < points; i++) {
    const t = new Date(now - (points - 1 - i) * stepMs).toISOString();
    cur = +(cur * (1 + (Math.sin(i / 3) * 0.01 + 0.002))).toFixed(2);
    list.push({ t, o: cur, h: cur * 1.005, l: cur * 0.995, c: cur, v: 10000 });
  }
  return list;
}
