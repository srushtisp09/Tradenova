import { cn } from '../../utils/cn';

export default function Card({ className, ...props }) {
  return <div className={cn('glass p-5', className)} {...props} />;
}
