import { cn } from '../../utils/cn';

// Gray placeholder with a moving shine, shown while data loads.
export default function Skeleton({ className }) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg bg-line/50', className)}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.6s_infinite]" />
    </div>
  );
}
