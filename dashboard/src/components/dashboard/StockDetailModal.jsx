import { Modal, Button } from '../ui';
import PriceChart from '../charts/PriceChart';
import LivePrice from './LivePrice';
import { Change } from './Change';
import { useTrading } from '../../context/TradingContext';
import { bySymbol as fallbackBySymbol } from '../../data/mockData';
import { inr } from '../../utils/format';

export default function StockDetailModal() {
  const { selectedStock, closeStockDetail, quotes, bySymbol = fallbackBySymbol, openOrder } = useTrading();

  if (!selectedStock) return null;

  const info = bySymbol[selectedStock] || { name: selectedStock, price: quotes[selectedStock] || 100 };
  const ltp = quotes[selectedStock] ?? info.price ?? 0;
  const prev = info.prev ?? ltp;
  const diff = ltp - prev;
  const pct = prev > 0 ? (diff / prev) * 100 : 0;

  const handleBuy = () => {
    closeStockDetail();
    openOrder(selectedStock, 'BUY');
  };

  const handleSell = () => {
    closeStockDetail();
    openOrder(selectedStock, 'SELL');
  };

  return (
    <Modal open={true} onClose={closeStockDetail} title={info.name || selectedStock}>
      <div className="space-y-5">
        {/* Header with symbol, name and live price */}
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line/40 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">{selectedStock}</h2>
              {info.sector && (
                <span className="rounded-md bg-line/30 px-2 py-0.5 text-xs text-mute">
                  {info.sector}
                </span>
              )}
            </div>
            <p className="text-sm text-mute">{info.name}</p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold">
              <LivePrice value={ltp} />
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs">
              <Change value={diff} />
              <span className="text-mute">·</span>
              <Change value={pct} kind="pct" />
            </div>
          </div>
        </div>

        {/* Real Chart */}
        <PriceChart symbol={selectedStock} height={260} />

        {/* Order Actions */}
        <div className="flex gap-3 pt-2">
          <Button className="flex-1 bg-profit hover:brightness-110 text-white font-semibold" onClick={handleBuy}>
            Buy {selectedStock}
          </Button>
          <Button variant="outline" className="flex-1 text-loss hover:bg-loss/10 font-semibold" onClick={handleSell}>
            Sell {selectedStock}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
