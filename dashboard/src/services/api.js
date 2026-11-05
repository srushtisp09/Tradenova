// API client for TradeNova Dashboard
const API_BASE = '/api';
const TOKEN_KEY = 'tradenova-token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  // Also clean up any legacy key if present
  localStorage.removeItem('tradenova_token');
}

async function request(path, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    // If not already on login or register page, clear token and redirect
    clearStoredToken();
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
      window.location.href = '/login';
    }
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: async (userData) => {
    const data = await request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
    if (data.token) setStoredToken(data.token);
    return data;
  },
  login: async (credentials) => {
    const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    if (data.token) setStoredToken(data.token);
    return data;
  },
  logout: () => {
    clearStoredToken();
  },
  getMe: () => request('/auth/me'),
  updateTrack: (track) => request('/auth/me', { method: 'PATCH', body: JSON.stringify({ track }) }),

  // Health
  checkHealth: () => request('/health'),

  // Instruments
  getInstruments: () => request('/instruments'),
  getInstrument: (symbol) => request(`/instruments/${symbol}`),
  getInstrumentHistory: (symbol, range = '1mo') => request(`/instruments/${symbol}/history?range=${range}`),

  // Quotes
  getQuotes: () => request('/quotes'),

  // Portfolio
  getPortfolio: () => request('/portfolio'),
  getPortfolioHistory: () => request('/portfolio/history'),
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
