import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { PieSlice } from '@/types/election';
import { PIE_ANIMATION_PROPS } from '@/lib/chart-animations';

interface MiniGenderChartProps {
  data: PieSlice[];
  onRefresh?: () => Promise<void> | void;
}

const MiniGenderChart = ({ data, onRefresh }: MiniGenderChartProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  const hasData = data.length > 0 && total > 0;

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
          <h3 className="text-xl font-semibold text-foreground">Gender</h3>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={handleRefreshClick}
            className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            aria-label="Refresh gender chart"
            aria-busy={isRefreshing}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>
      <div className="h-64 flex flex-col">
        {hasData ? (
          <div className="flex-1 flex flex-col gap-4">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={1}
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
            </div>
            <div className="space-y-3">
              {data.map((slice) => {
                const percentage = total ? ((slice.value / total) * 100).toFixed(1) : '0.0';
                return (
                  <div key={slice.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="text-muted-foreground">{slice.label}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground font-medium">{slice.value.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-2xl">
            No gender data available.
          </div>
        )}
      </div>
    </section>
  );
};

export default MiniGenderChart;
