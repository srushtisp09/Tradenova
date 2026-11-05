import { Button, Card, Skeleton } from '../ui';

// What to show while data loads, and when loading fails.
export function Loading() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function ErrorBox({ message, onRetry }) {
  return (
    <Card className="mx-auto max-w-lg py-10 text-center">
      <h2 className="text-xl">Something went wrong</h2>
      <p role="alert" className="mt-2 text-sm text-loss">{message}</p>
      <Button className="mt-6" onClick={onRetry}>Retry</Button>
    </Card>
  );
}
