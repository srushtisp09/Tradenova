// Number formatting helpers (Indian rupee style: 12,48,320.50)
export const inr = (n, digits = 2) =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const signedInr = (n) => (n >= 0 ? '+' : '−') + inr(Math.abs(n));
export const signedPct = (n) => (n >= 0 ? '+' : '−') + Math.abs(n).toFixed(2) + '%';
