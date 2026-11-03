import { Card } from '../ui';

export default function StatCard({ label, value, children }) {
  return (
    <Card className="p-4 sm:p-5">
      <p className="text-sm text-mute">{label}</p>
      <p className="num mt-1 text-xl font-semibold sm:text-2xl">{value}</p>
      {children && <div className="mt-2 text-sm">{children}</div>}
    </Card>
  );
}
