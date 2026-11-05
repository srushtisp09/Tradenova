// Demo data for the database. Same numbers the dashboard used before, now stored in MongoDB.
export const instruments = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', price: 2918.4, prevClose: 2884.1 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', price: 4102.15, prevClose: 4119.0 },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT', price: 1874.6, prevClose: 1859.8 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', price: 1652.3, prevClose: 1655.6 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', price: 1248.75, prevClose: 1241.3 },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', price: 812.9, prevClose: 800.9 },
  { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', price: 468.25, prevClose: 471.5 },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'IT', price: 552.1, prevClose: 550.45 },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', price: 3640.85, prevClose: 3608.4 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', price: 1582.2, prevClose: 1570.1 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', price: 968.4, prevClose: 975.2 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer', price: 2415.5, prevClose: 2432.8 },
  { symbol: 'NIFTY', name: 'NIFTY 50', sector: 'Index', price: 24520.35, prevClose: 24410.1, isIndex: true },
  { symbol: 'SENSEX', name: 'SENSEX', sector: 'Index', price: 80650.2, prevClose: 80290.55, isIndex: true },
];

export const startingCash = 1000000;

export const holdings = [
  { symbol: 'RELIANCE', qty: 25, avgPrice: 2610.5 },
  { symbol: 'TCS', qty: 10, avgPrice: 3820.0 },
  { symbol: 'INFY', qty: 40, avgPrice: 1690.25 },
  { symbol: 'HDFCBANK', qty: 30, avgPrice: 1710.8 },
  { symbol: 'ITC', qty: 100, avgPrice: 395.6 },
  { symbol: 'SBIN', qty: 60, avgPrice: 640.1 },
  { symbol: 'WIPRO', qty: 50, avgPrice: 585.0 },
  { symbol: 'LT', qty: 8, avgPrice: 3320.0 },
];

export const positions = [
  { symbol: 'ICICIBANK', product: 'MIS', qty: 50, avgPrice: 1243.1 },
  { symbol: 'TATAMOTORS', product: 'MIS', qty: 80, avgPrice: 972.0 },
  { symbol: 'BHARTIARTL', product: 'MIS', qty: 20, avgPrice: 1576.4 },
];

export const watchlist = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'SBIN', 'LT'];
