import { PieChart, Pie, Cell, ResponsiveContainer, LabelList, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieSlice, BarStat, CasteData } from '@/types/election';
import { Button } from '@/components/ui/button';
import { Filter, MoreHorizontal, RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { PIE_ANIMATION_PROPS, BAR_ANIMATION_PROPS } from '@/lib/chart-animations';

interface DataInsightPanelProps {
  houseOwnership: PieSlice[];
  societyDistribution: PieSlice[];
  wardDistribution: PieSlice[];
  professionStats: BarStat[];
  educationStats: BarStat[];
  motherTongueDistribution: PieSlice[];
  genderDistribution: PieSlice[];
  ageDistribution: BarStat[];
  casteDistribution: CasteData[];
}

const cardStyle =
  'bg-[#0f1118] border border-white/5 rounded-2xl p-5 text-white shadow-[0_10px_40px_rgba(15,17,24,0.8)] relative overflow-hidden';

const ChartHeader = ({
  title,
  subtitle,
  legend,
}: {
  title: string;
  subtitle: string;
  legend: PieSlice[];
}) => (
  <div className="flex flex-col gap-3">
    <div>
      <p className="uppercase tracking-[0.2em] text-xs text-white/60">{title}</p>
      <h3 className="text-2xl font-semibold text-white">{subtitle}</h3>
    </div>
    <div className="flex flex-wrap gap-3 text-sm text-white/70">
      {legend.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full border border-white/30"
            {...PIE_ANIMATION_PROPS}
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </span>
      ))}
    </div>
  </div>
);

const HeaderActions = () => (
  <div className="flex items-center gap-2">
    <Button variant="outline" className="bg-[#1f2331] border-white/10 text-white hover:bg-[#202638]">
      Data
    </Button>
    <button className="p-2 rounded-lg bg-[#1c1f2b] border border-white/10 hover:bg-[#24283a]" aria-label="Filter">
      <Filter className="w-4 h-4 text-white" />
    </button>
    <button className="p-2 rounded-lg bg-[#1c1f2b] border border-white/10 hover:bg-[#24283a]" aria-label="More">
      <MoreHorizontal className="w-4 h-4 text-white" />
    </button>
    <button className="p-2 rounded-lg bg-[#1c1f2b] border border-white/10 hover:bg-[#24283a]" aria-label="Refresh">
      <RefreshCw className="w-4 h-4 text-white" />
    </button>
  </div>
);

const PieCard = ({ title, subtitle, data }: { title: string; subtitle: string; data: PieSlice[] }) => (
  <section className={cardStyle}>
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <ChartHeader title={title} subtitle={subtitle} legend={data} />
      <HeaderActions />
    </div>
    <div className="h-72 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={120}
            label={({ percent }) => `${Math.round((percent ?? 0) * 100)}%`}
            labelLine={false}
          >
            {data.map((slice) => (
              <Cell key={slice.label} fill={slice.color} stroke="#0f1118" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(15, 17, 24, 0.2)',
              borderRadius: '0.75rem',
              color: '#111111',
              fontWeight: 600,
            }}
            formatter={(value: number, name: string) => [`${value}%`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </section>
);

const BarCard = ({
  title,
  subtitle,
  data,
  barColor,
}: {
  title: string;
  subtitle: string;
  data: BarStat[];
  barColor: string;
}) => (
  <section className={cardStyle}>
    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
      <div>
        <p className="uppercase tracking-[0.2em] text-xs text-white/60">{title}</p>
        <h3 className="text-2xl font-semibold text-white">{subtitle}</h3>
        <div className="mt-3 inline-flex items-center gap-2 text-sm text-white/70">
          <span className="inline-flex h-3 w-6 rounded-full" style={{ backgroundColor: barColor }} />
          Count
        </div>
      </div>
      <HeaderActions />
    </div>

    <div className="h-72 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 30 }}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.2)" strokeDasharray="6 6" />
          <XAxis
            dataKey="label"
            stroke="#6b7280"
            tick={{ fill: '#cbd5f5', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis stroke="#6b7280" tick={{ fill: '#cbd5f5', fontSize: 12 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(15, 17, 24, 0.2)',
              borderRadius: '0.75rem',
              color: '#111111',
              fontWeight: 600,
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={barColor} {...BAR_ANIMATION_PROPS}>
            <LabelList dataKey="value" position="top" fill="#fff" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
);

const DataInsightPanel = ({
  houseOwnership,
  societyDistribution,
  wardDistribution,
  professionStats,
  educationStats,
  motherTongueDistribution,
  genderDistribution,
  ageDistribution,
  casteDistribution,
}: DataInsightPanelProps) => {
  const casteSlices = useMemo<PieSlice[]>(
    () => casteDistribution.map((item) => ({ label: item.name, value: item.value, color: item.color })),
    [casteDistribution]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <PieCard title="House" subtitle="House (Own / Rent / Lease)" data={houseOwnership} />
        <PieCard title="Society" subtitle="Society Participation" data={societyDistribution} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <PieCard title="Ward No" subtitle="Ward Distribution" data={wardDistribution} />
        <PieCard title="Mother Tongue" subtitle="Language Preference" data={motherTongueDistribution} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <PieCard title="Gender" subtitle="Gender Overview" data={genderDistribution} />
        <PieCard title="Caste" subtitle="Community Split" data={casteSlices} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <BarCard title="Profession" subtitle="Profession" data={professionStats} barColor="#22c55e" />
        <BarCard title="Education" subtitle="Education" data={educationStats} barColor="#3b82f6" />
      </div>
      <BarCard title="Age" subtitle="Age Range" data={ageDistribution} barColor="#a855f7" />
    </div>
  );
};

export default DataInsightPanel;
