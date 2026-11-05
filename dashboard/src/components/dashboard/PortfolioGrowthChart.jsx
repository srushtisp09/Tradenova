import { useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import '../charts/chartConfig';
import { inr } from '../../utils/format';

export default function PortfolioGrowthChart({ snapshots = [], currentNetWorth }) {
  const chartRef = useRef(null);

  // If there are fewer than 2 data points, show the placeholder message
  if (!snapshots || snapshots.length < 2) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-line/50 p-6 text-center">
        <span className="text-3xl mb-2">📈</span>
        <p className="font-semibold text-ink">Your growth chart appears after your first two days.</p>
        <p className="mt-1 text-xs text-mute max-w-sm">
          We record a daily snapshot of your portfolio value each day you visit TradeNova so you can track your journey over time.
        </p>
      </div>
    );
  }

  const isUp = useMemo(() => {
    if (snapshots.length < 2) return true;
    return snapshots[snapshots.length - 1].netWorth >= snapshots[0].netWorth;
  }, [snapshots]);

  const chartData = useMemo(() => {
    const labels = snapshots.map((s) => {
      const dt = new Date(s.date);
      return dt.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    });

    const values = snapshots.map((s) => s.netWorth);

    return {
      labels,
      datasets: [
        {
          fill: true,
          label: 'Net worth',
          data: values,
          borderColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return '#3B82F6';
            const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
            gradient.addColorStop(0, '#3B82F6');
            gradient.addColorStop(0.7, '#8B5CF6');
            gradient.addColorStop(1, isUp ? '#22C55E' : '#EF4444');
            return gradient;
          },
          borderWidth: 2.5,
          pointRadius: 3,
          pointBackgroundColor: '#8B5CF6',
          pointBorderColor: '#050505',
          pointBorderWidth: 1.5,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: isUp ? '#22C55E' : '#EF4444',
          tension: 0.3,
          backgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'rgba(59, 130, 246, 0.15)';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.25)');
            gradient.addColorStop(0.8, 'rgba(139, 92, 246, 0.05)');
            gradient.addColorStop(1, 'rgba(11, 15, 23, 0)');
            return gradient;
          },
        },
      ],
    };
  }, [snapshots, isUp]);

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
        displayColors: false,
        callbacks: {
          title: (items) => {
            if (!items.length) return '';
            const idx = items[0].dataIndex;
            const s = snapshots[idx];
            return s ? new Date(s.date).toLocaleDateString('en-IN', { dateStyle: 'long' }) : items[0].label;
          },
          label: (context) => `Net Worth: ${inr(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
        ticks: { color: '#64748B', font: { size: 11 }, maxTicksLimit: 8 },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
        ticks: {
          color: '#64748B',
          font: { size: 11 },
          callback: (value) => inr(value, 0),
        },
      },
    },
  }), [snapshots]);

  return (
    <div className="relative h-64 w-full">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}
