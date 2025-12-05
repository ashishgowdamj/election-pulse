import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { BarStat } from '@/types/election';
import { BAR_ANIMATION_PROPS } from '@/lib/chart-animations';

interface MiniAgeChartProps {
  data: BarStat[];
  onRefresh?: () => Promise<void> | void;
}

const MiniAgeChart = ({ data, onRefresh }: MiniAgeChartProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasData = data.length > 0;

  const maxValue = useMemo(() => (hasData ? Math.max(...data.map((entry) => entry.value)) : 0), [data, hasData]);

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">Age</h3>
        {onRefresh && (
          <button
            type="button"
            onClick={handleRefreshClick}
            className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            aria-label="Refresh age chart"
            aria-busy={isRefreshing}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>
      <div className="h-72">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 4, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                domain={[0, maxValue]}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                formatter={(value: number) => [`${Number(value).toLocaleString()} voters`, 'Voters']}
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--stat-green))"
                radius={[6, 6, 0, 0]}
                {...BAR_ANIMATION_PROPS}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-2xl">
            No age data available.
          </div>
        )}
      </div>
    </section>
  );
};

export default MiniAgeChart;
