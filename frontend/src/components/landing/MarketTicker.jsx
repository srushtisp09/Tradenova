// Scrolling strip of prices. These numbers are fixed demo values, not live data.
const items = [
  ['RELIANCE', '2,918.40', 1.2], ['TCS', '4,102.15', -0.4], ['INFY', '1,874.60', 0.8],
  ['HDFCBANK', '1,652.30', -0.2], ['ICICIBANK', '1,248.75', 0.6], ['SBIN', '812.90', 1.5],
  ['ITC', '468.25', -0.7], ['WIPRO', '552.10', 0.3], ['LT', '3,640.85', 0.9],
];

function Row() {
  return items.map(([sym, price, ch]) => (
    <span key={sym} className="mx-6 inline-flex items-center gap-2 text-sm">
      <span className="font-semibold">{sym}</span>
      <span className="num text-mute">{price}</span>
      <span className={`num ${ch >= 0 ? 'text-profit' : 'text-loss'}`}>{ch >= 0 ? '▲' : '▼'} {Math.abs(ch)}%</span>
    </span>
  ));
}

export default function MarketTicker() {
  return (
    <div className="border-y border-line/60 bg-card/40 py-3" aria-label="Sample market prices, demo data">
      <div className="overflow-hidden whitespace-nowrap">
        <div className="marquee inline-block">
          <Row /><Row />
        </div>
      </div>
      <p className="sr-only">Demo prices for illustration only.</p>
    </div>
  );
}
