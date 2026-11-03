// Which sector each demo stock belongs to (used by the Pro insights).
const sectors = {
  RELIANCE: 'Energy', TCS: 'IT', INFY: 'IT', WIPRO: 'IT',
  HDFCBANK: 'Banking', ICICIBANK: 'Banking', SBIN: 'Banking',
  ITC: 'FMCG', LT: 'Infrastructure', BHARTIARTL: 'Telecom',
  TATAMOTORS: 'Auto', ASIANPAINT: 'Consumer',
};
export const sectorOf = (symbol) => sectors[symbol] || 'Other';
