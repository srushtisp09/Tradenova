// API client for TradeNova Dashboard
const API_BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('tradenova_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  signup: async (userData) => {
    const data = await request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) });
    if (data.token) localStorage.setItem('tradenova_token', data.token);
    return data;
  },
  login: async (credentials) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (data.token) localStorage.setItem('tradenova_token', data.token);
    return data;
  },
  logout: () => {
    localStorage.removeItem('tradenova_token');
  },
  getMe: () => request('/auth/me'),

  // Health
  checkHealth: () => request('/health'),

  // Instruments
  getInstruments: () => request('/instruments'),
  getInstrument: (symbol) => request(`/instruments/${symbol}`),

  // Portfolio
  getPortfolio: () => request('/portfolio'),
  getHoldings: () => request('/portfolio/holdings'),
  getPositions: () => request('/portfolio/positions'),

  // Watchlist
  getWatchlist: () => request('/watchlist'),
  addToWatchlist: (symbol) => request('/watchlist', { method: 'POST', body: JSON.stringify({ symbol }) }),
  removeFromWatchlist: (symbol) => request(`/watchlist/${symbol}`, { method: 'DELETE' }),

  // Orders
  getOrders: () => request('/orders'),
  placeOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
};

export default api;
