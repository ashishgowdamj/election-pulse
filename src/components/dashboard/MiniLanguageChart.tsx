import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { PieSlice } from '@/types/election';
import { PIE_ANIMATION_PROPS } from '@/lib/chart-animations';
import PieLegendDropdown, { LegendItem } from './PieLegendDropdown';

interface MiniLanguageChartProps {
  data: PieSlice[];
  onRefresh?: () => Promise<void> | void;
}

const MiniLanguageChart = ({ data, onRefresh }: MiniLanguageChartProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const hasData = data.length > 0 && total > 0;
  const legendItems = useMemo<LegendItem[]>(
    () =>
      total
        ? data.map((slice) => ({
            label: slice.label,
            value: slice.value,
            percentage: ((slice.value / total) * 100).toFixed(1),
            color: slice.color,
          }))
        : [],
    [data, total]
  );

  const handleRefreshClick = async () => {
    if (!onRefresh || isRefreshing) return;
    try {
      setIsRefreshing(true);
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-5 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-xl font-semibold text-foreground">Language</h3>
        <div className="flex items-center gap-2">
          {hasData && <PieLegendDropdown items={legendItems} triggerLabel="Legend" />}
          {onRefresh && (
            <button
              type="button"
              onClick={handleRefreshClick}
              className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              aria-label="Refresh language chart"
              aria-busy={isRefreshing}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>
      <div className="h-72">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 0, right: 16, bottom: 0, left: 16 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={108}
                paddingAngle={2}
                strokeWidth={0}
                {...PIE_ANIMATION_PROPS}
              >
                {data.map((slice) => (
                  <Cell key={slice.label} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                formatter={(value: number, name: string) => [
                  `${Number(value).toLocaleString()} voters`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-2xl">
            No language data available.
          </div>
        )}
      </div>
    </section>
  );
};

export default MiniLanguageChart;
