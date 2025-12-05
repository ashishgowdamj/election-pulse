import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CasteData } from '@/types/election';
import { RefreshCw } from 'lucide-react';

interface CasteWiseChartProps {
  data: CasteData[];
  onRefresh?: () => void;
}

const CasteWiseChart = ({ data, onRefresh }: CasteWiseChartProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-card-foreground">Caste Wise Reports</h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value}%`, 'Percentage']}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-card-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CasteWiseChart;
