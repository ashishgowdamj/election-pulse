import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GenderBoothData } from '@/types/election';

interface GenderBoothChartProps {
  data: GenderBoothData[];
}

const GenderBoothChart = ({ data }: GenderBoothChartProps) => {
  return (
    <div className="bg-card rounded-lg p-4 shadow-md">
      <h3 className="font-heading font-semibold text-card-foreground mb-4">
        Gender Wise Report as per Booth
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            barSize={12}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="booth" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend 
              iconType="square"
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Bar dataKey="male" fill="hsl(var(--stat-blue))" name="Male" radius={[2, 2, 0, 0]} />
            <Bar dataKey="female" fill="hsl(var(--stat-green))" name="Female" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GenderBoothChart;
