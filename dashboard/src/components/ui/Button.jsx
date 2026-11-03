import { cn } from '../../utils/cn';

// Pill buttons with small spaced capitals, like the Skip and Close buttons on the 3D page.
const variants = {
  primary: 'bg-ink text-bg hover:bg-white',
  outline: 'border border-ink/70 text-ink hover:border-white hover:bg-white/10',
  ghost: 'text-mute hover:text-ink',
};
const sizes = { sm: 'px-4 py-1.5 text-[11px]', md: 'px-6 py-2.5 text-xs', lg: 'px-8 py-3.5 text-sm' };

export default function Button({ variant = 'primary', size = 'md', className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium uppercase tracking-[.14em] transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variants[variant], sizes[size], className
      )}
      {...props}
    />
  );
}
