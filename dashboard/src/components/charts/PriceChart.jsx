import { useState, useEffect, useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import './chartConfig'; // registers required Chart.js modules
import api from '../../services/api';
import { inr } from '../../utils/format';

const RANGES = [
  { id: '1d', label: '1D' },
  { id: '5d', label: '1W' },
  { id: '1mo', label: '1M' },
  { id: '6mo', label: '6M' },
  { id: '1y', label: '1Y' },
];

export default function PriceChart({ symbol, height = 300 }) {
  const [range, setRange] = useState('1mo');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    api.getInstrumentHistory(symbol, range)
      .then((history) => {
        if (!active) return;
        if (Array.isArray(history) && history.length > 0) {
          setData(history);
        } else {
          setError('No price history available');
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to load chart');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [symbol, range]);

  // Determine trend: compare first price to last price
  const isUp = useMemo(() => {
    if (!data || data.length < 2) return true;
    return data[data.length - 1].c >= data[0].c;
  }, [data]);

  const chartData = useMemo(() => {
    const labels = data.map((d) => {
      const dt = new Date(d.t);
      if (range === '1d') {
        return dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      }
      return dt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    });

    const prices = data.map((d) => d.c);

    return {
      labels,
      datasets: [
        {
          fill: true,
          label: symbol,
          data: prices,
          borderColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return isUp ? '#22C55E' : '#EF4444';
            const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
            gradient.addColorStop(0, '#3B82F6'); // blue
            gradient.addColorStop(0.6, '#8B5CF6'); // violet
            gradient.addColorStop(1, isUp ? '#22C55E' : '#EF4444'); // green / red end colour
            return gradient;
          },
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: isUp ? '#22C55E' : '#EF4444',
          pointHoverBorderColor: '#000000',
          pointHoverBorderWidth: 2,
          tension: 0.25,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(59, 130, 246, 0.1)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, isUp ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)');
            gradient.addColorStop(0.7, 'rgba(59, 130, 246, 0.08)');
            gradient.addColorStop(1, 'rgba(11, 15, 23, 0)');
            return gradient;
          },
        },
      ],
    };
  }, [data, range, symbol, isUp]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#94A3B8',
        bodyColor: '#F8FAFC',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        displayColors: false,
        callbacks: {
          title: (items) => {
            if (!items.length) return '';
            const idx = items[0].dataIndex;
            const point = data[idx];
            if (!point) return items[0].label;
            const dt = new Date(point.t);
            return dt.toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: range === '1d' || range === '5d' ? 'short' : undefined,
            });
          },
          label: (context) => `Price: ${inr(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748B',
          font: { size: 11 },
          maxTicksLimit: 7,
          maxRotation: 0,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748B',
          font: { size: 11 },
          callback: (value) => inr(value, 0),
        },
      },
    },
  }), [data, range]);

  return (
    <div className="flex flex-col space-y-3">
      {/* Range filter buttons */}
      <div className="flex items-center justify-between border-b border-line/40 pb-2">
        <span className="text-xs uppercase tracking-wider text-mute">Price Chart</span>
        <div className="flex gap-1" role="group" aria-label="Select chart range">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`rounded px-2.5 py-1 text-xs font-semibold transition ${
                range === r.id
                  ? 'bg-ink text-bg'
                  : 'text-mute hover:bg-line/30 hover:text-ink'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container */}
      <div className="relative w-full" style={{ height: `${height}px` }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg/60 backdrop-blur-xs z-10">
            <span className="text-sm text-mute animate-pulse">Loading chart data...</span>
          </div>
        )}
        {error ? (
          <div className="flex h-full items-center justify-center text-center p-4">
            <div className="text-sm text-mute">
              <p className="text-loss mb-1">⚠️ {error}</p>
              <button
                onClick={() => setRange((r) => r)}
                className="mt-2 text-xs underline hover:text-ink"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <Line ref={chartRef} data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}
