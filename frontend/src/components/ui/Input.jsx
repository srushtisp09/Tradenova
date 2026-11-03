import { cn } from '../../utils/cn';

export default function Input({ label, id, className, ...props }) {
  return (
    <label htmlFor={id} className="block text-sm">
      {label && <span className="mb-1.5 block text-mute">{label}</span>}
      <input
        id={id}
        className={cn(
          'w-full rounded-md border border-line bg-bg/60 px-4 py-2.5 text-ink placeholder:text-mute/60 transition focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink/40',
          className
        )}
        {...props}
      />
    </label>
  );
}
