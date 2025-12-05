import { ChevronDown, Palette } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type LegendItem = {
  label: string;
  value: number;
  percentage: string;
  color: string;
};

interface PieLegendDropdownProps {
  items: LegendItem[];
  triggerLabel?: string;
  buttonClassName?: string;
  showIcon?: boolean;
}

const PieLegendDropdown = ({
  items,
  triggerLabel = 'Legend',
  buttonClassName,
  showIcon = false,
}: PieLegendDropdownProps) => {
  if (!items.length) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'text-xs px-2 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 bg-transparent transition-colors',
            buttonClassName
          )}
        >
          {showIcon && <Palette className="h-3.5 w-3.5" />}
          <span>{triggerLabel}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 bg-card border-border text-foreground p-2 space-y-1 max-h-64 overflow-y-auto"
      >
        {items.map((item) => (
          <DropdownMenuItem key={item.label} className="focus:bg-muted rounded-lg">
            <div className="flex items-center gap-2 w-full">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="flex-1 truncate text-sm">{item.label}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {item.value.toLocaleString()} ({item.percentage}%)
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PieLegendDropdown;
