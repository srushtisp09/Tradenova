// Formats a number as Indian rupees: 1248320.5 -> "₹12,48,320.50"
export const inr = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
