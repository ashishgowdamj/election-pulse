import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: number;
  label: string;
  variant: 'red' | 'blue' | 'green' | 'orange' | 'yellow' | 'teal';
  icon?: React.ReactNode;
  onRefresh?: () => void;
  className?: string;
}

const StatCard = ({ value, label, variant, icon, onRefresh, className }: StatCardProps) => {
  const variantClasses = {
    red: 'stat-card-red',
    blue: 'stat-card-blue',
    green: 'stat-card-green',
    orange: 'stat-card-orange',
    yellow: 'stat-card-yellow',
    teal: 'stat-card-teal',
  };

  return (
    <div
      className={cn(
        'rounded-lg px-4 py-3 text-primary-foreground shadow-md transition-transform hover:scale-[1.01]',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-2xl font-bold font-heading animate-count-up leading-tight">
            {value.toLocaleString()}
          </p>
          <p className="text-xs opacity-90 mt-1 tracking-wide uppercase">{label}</p>
        </div>
        {icon && (
          <div className="opacity-90">
            {icon}
          </div>
        )}
      </div>
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="mt-3 flex items-center gap-1 text-xs opacity-80 hover:opacity-100 transition-opacity"
        >
          Refresh <RefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default StatCard;
