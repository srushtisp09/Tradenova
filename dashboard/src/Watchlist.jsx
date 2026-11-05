// The only place that talks to the backend. Pages call these small functions.
// "/api/..." works because vite.config.js sends /api to http://localhost:5000.
async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }
  let data = null;
  try { data = await res.json(); } catch { /* an empty reply is fine */ }
  if (!res.ok) {
    // The dev proxy answers 5xx with no message when the backend is off
    const fallback = res.status >= 500 ? 'Cannot reach the server. Is the backend running?' : `Request failed (${res.status})`;
    throw new Error(data?.error || fallback);
  }
  return data;
}

export const getInstruments = () => request('/instruments');
export const getPortfolio = () => request('/portfolio');
export const getHoldings = () => request('/portfolio/holdings');
export const getPositions = () => request('/portfolio/positions');
export const getWatchlist = () => request('/watchlist');
export const addToWatchlist = (symbol) => request('/watchlist', { method: 'POST', body: { symbol } });
export const removeFromWatchlist = (symbol) => request(`/watchlist/${symbol}`, { method: 'DELETE' });
export const getOrders = () => request('/orders');
export const placeOrder = (order) => request('/orders', { method: 'POST', body: order });
