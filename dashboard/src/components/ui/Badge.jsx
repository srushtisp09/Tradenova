import { cn } from '../../utils/cn';

const tones = {
  profit: 'bg-profit/15 text-profit',
  loss: 'bg-loss/15 text-loss',
  info: 'bg-primary/15 text-primary',
  neutral: 'bg-line/60 text-mute',
};

export default function Badge({ tone = 'neutral', className, ...props }) {
  return (
    <span className={cn('num inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone], className)} {...props} />
  );
}
