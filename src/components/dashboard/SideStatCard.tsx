import { cn } from '@/lib/utils';

interface SideStatCardProps {
  value: number;
  label: string;
  icon: React.ReactNode;
  variant: 'orange' | 'red' | 'teal' | 'yellow' | 'green';
  className?: string;
}

const SideStatCard = ({ value, label, icon, variant, className }: SideStatCardProps) => {
  const variantClasses = {
    orange: 'stat-card-orange',
    red: 'stat-card-red',
    teal: 'stat-card-teal',
    yellow: 'stat-card-yellow',
    green: 'stat-card-green',
  };

  return (
    <div
      className={cn(
        'rounded-lg p-3 text-primary-foreground shadow-md flex items-center gap-3',
        variantClasses[variant],
        className
      )}
    >
      <div className="p-2 bg-primary-foreground/20 rounded-lg">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold font-heading">{value.toLocaleString()}</p>
        <p className="text-xs opacity-90 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
};

export default SideStatCard;
