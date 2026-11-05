import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '../components/ui';
import DataTable from '../components/dashboard/DataTable';
import api from '../services/api';
import { inr } from '../utils/format';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Failed to load orders from API:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns = [
    {
      key: 'symbol',
      label: 'Instrument',
      render: (r) => (
        <div>
          <p className="font-semibold">{r.symbol}</p>
          <p className="text-xs text-mute capitalize">{r.type.toLowerCase()} order</p>
        </div>
      ),
    },
    {
      key: 'side',
      label: 'Side',
      render: (r) => (
        <Badge variant={r.side === 'BUY' ? 'success' : 'danger'}>
          {r.side}
        </Badge>
      ),
    },
    {
      key: 'qty',
      label: 'Qty',
      align: 'right',
      render: (r) => <span className="num">{r.qty}</span>,
    },
    {
      key: 'price',
      label: 'Price',
      align: 'right',
      render: (r) => (
        <span className="num">
          {r.type === 'LIMIT' && r.limitPrice ? inr(r.limitPrice) : 'Market'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      align: 'center',
      render: (r) => (
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {r.status || 'OPEN'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Time',
      align: 'right',
      render: (r) => (
        <span className="text-xs text-mute">
          {r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="glass p-8 text-center text-mute">
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="mx-auto max-w-lg py-12 text-center">
        <h2 className="text-xl font-semibold">No orders placed yet</h2>
        <p className="mt-2 text-mute">Place a buy or sell order from your watchlist or holdings.</p>
        <Link to="/watchlist">
          <Button className="mt-6">Go to Watchlist</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Order History</h1>
          <p className="text-xs text-mute">Showing recent paper trades saved in MongoDB</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>

      <div className="glass">
        <DataTable columns={columns} data={orders} />
      </div>
    </div>
  );
}
