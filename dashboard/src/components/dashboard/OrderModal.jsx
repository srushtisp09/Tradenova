import { useState } from 'react';
import { Button, Input, Modal } from '../ui';
import { useTrading } from '../../context/TradingContext';
import { bySymbol as fallbackBySymbol } from '../../data/mockData';
import { inr } from '../../utils/format';
import api from '../../services/api';

// The Buy / Sell window. Submits orders to our MongoDB Atlas backend.
function OrderForm({ symbol, initialSide, onClose }) {
  const { quotes, bySymbol = fallbackBySymbol } = useTrading();
  const info = bySymbol[symbol] || { name: symbol, price: quotes[symbol] || 100 };
  const ltp = quotes[symbol] ?? info.price;

  const [side, setSide] = useState(initialSide);
  const [qty, setQty] = useState('1');
  const [type, setType] = useState('MARKET');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const price = type === 'LIMIT' ? Number(limit) : ltp;
  const amount = (Number(qty) || 0) * (price || 0);

  const submit = async (e) => {
    e.preventDefault();
    const numQty = Number(qty);
    if (!Number.isInteger(numQty) || numQty < 1) {
      return setError('Quantity must be a whole number, at least 1.');
    }
    if (type === 'LIMIT' && !(Number(limit) > 0)) {
      return setError('Enter a limit price above zero.');
    }

    setError('');
    setLoading(true);

    try {
      const orderPayload = {
        symbol,
        side,
        type,
        qty: numQty,
        ...(type === 'LIMIT' ? { limitPrice: Number(limit) } : {}),
      };

      const result = await api.placeOrder(orderPayload);
      setPlacedOrder(result);
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="text-center py-4 space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-profit/10 text-profit">
          ✓
        </div>
        <p className="text-lg font-semibold">{side === 'BUY' ? 'Buy' : 'Sell'} order placed!</p>
        <p className="text-sm text-mute">
          {qty} × {symbol} at {type === 'LIMIT' ? inr(price) : 'market price'}. Status: <span className="font-semibold text-primary uppercase">{placedOrder.status || 'OPEN'}</span>
        </p>
        <Button className="mt-4 w-full" onClick={onClose}>Done</Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <p className="font-semibold">{symbol}</p>
        <p className="text-sm text-mute">{info.name} • <span className="num">{inr(ltp)}</span></p>
      </div>

      <div className="grid grid-cols-2 gap-2" role="group" aria-label="Order side">
        {['BUY', 'SELL'].map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setSide(s)}
            aria-pressed={side === s}
            className={`rounded-xl py-2.5 font-semibold transition ${
              side === s
                ? s === 'BUY'
                  ? 'bg-profit text-white'
                  : 'bg-loss text-white'
                : 'border border-line text-mute'
            }`}
          >
            {s === 'BUY' ? 'Buy' : 'Sell'}
          </button>
        ))}
      </div>

      <Input
        id="ord-qty"
        label="Quantity"
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />

      <label className="block text-sm">
        <span className="mb-1.5 block text-mute">Order type</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-xl border border-line bg-bg/60 px-4 py-2.5 text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="MARKET">Market (at current price)</option>
          <option value="LIMIT">Limit (my own price)</option>
        </select>
      </label>

      {type === 'LIMIT' && (
        <Input
          id="ord-limit"
          label="Limit price (₹)"
          type="number"
          step="0.05"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
      )}

      <div className="flex items-center justify-between rounded-xl bg-line/30 px-4 py-3 text-sm">
        <span className="text-mute">Estimated amount</span>
        <span className="num font-semibold">{inr(amount)}</span>
      </div>

      {error && <p role="alert" className="text-sm text-loss">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className={`w-full ${side === 'SELL' ? '!bg-loss !text-white' : ''}`}
      >
        {loading ? 'Submitting...' : side === 'BUY' ? 'Place buy order' : 'Place sell order'}
      </Button>
    </form>
  );
}

export default function OrderModal() {
  const { order, closeOrder } = useTrading();
  return (
    <Modal open={!!order} onClose={closeOrder} title="Order window">
      {order && (
        <OrderForm
          key={order.symbol + order.side}
          symbol={order.symbol}
          initialSide={order.side}
          onClose={closeOrder}
        />
      )}
    </Modal>
  );
}
