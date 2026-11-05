import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import '../charts/chartConfig';
import { inr } from '../../utils/format';

const SLICE_COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#A78BFA', '#38BDF8', '#64748B'];

export default function HoldingsDoughnut({ holdings = [], totalValue = 0 }) {
  // Shares: top 5 + "Others"
  const { slices, total } = useMemo(() => {
    if (!holdings || holdings.length === 0) {
      return { slices: [], total: 0 };
    }

    const sorted = [...holdings].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, 5).map((h) => ({ label: h.symbol, value: h.value }));
    const othersValue = sorted.slice(5).reduce((s, h) => s + h.value, 0);
    const result = othersValue > 0 ? [...top, { label: 'Others', value: othersValue }] : top;
    const calcTotal = totalValue || result.reduce((s, r) => s + r.value, 0);

    return { slices: result, total: calcTotal };
  }, [holdings, totalValue]);

  const chartData = useMemo(() => ({
    labels: slices.map((s) => s.label),
    datasets: [
      {
        data: slices.map((s) => s.value),
        backgroundColor: slices.map((_, i) => SLICE_COLORS[i % SLICE_COLORS.length]),
        borderColor: '#050505',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  }), [slices]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0F172A',
        titleColor: '#94A3B8',
        bodyColor: '#F8FAFC',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : '0';
            return ` ${context.label}: ${inr(val)} (${pct}%)`;
          },
        },
      },
    },
  }), [total]);

  if (slices.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center text-mute">
        <p className="text-sm">No holdings yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Doughnut canvas with center label */}
      <div className="relative mx-auto h-48 w-48">
        <Doughnut data={chartData} options={options} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] uppercase tracking-wider text-mute">Holdings</span>
          <span className="num text-sm font-semibold text-ink">{inr(total, 0)}</span>
        </div>
      </div>

      {/* Legend list */}
      <ul className="space-y-2 text-sm pt-2">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: SLICE_COLORS[i % SLICE_COLORS.length] }}
              />
              <span className="font-medium text-ink">{s.label}</span>
            </span>
            <span className="num text-mute">
              {total > 0 ? ((s.value / total) * 100).toFixed(1) : '0.0'}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
