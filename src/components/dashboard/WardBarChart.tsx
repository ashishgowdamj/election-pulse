import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import type { BarStat } from '@/types/election';
import { BAR_ANIMATION_PROPS } from '@/lib/chart-animations';

interface WardBarChartProps {
  data: BarStat[];
  onRefresh?: () => Promise<void> | void;
}

const WardBarChart = ({ data, onRefresh }: WardBarChartProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasData = data.length > 0;

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
        <div>
          <h3 className="text-xl font-semibold text-foreground">Wards</h3>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={handleRefreshClick}
            className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            aria-label="Refresh ward chart"
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
            <BarChart data={data} margin={{ top: 10, right: 8, left: -28, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(var(--stat-blue))" {...BAR_ANIMATION_PROPS} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-2xl">
            No ward distribution available.
          </div>
        )}
      </div>
    </section>
  );
};

export default WardBarChart;
