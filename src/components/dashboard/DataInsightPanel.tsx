import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PieSlice, BarStat, CasteData } from '@/types/election';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useMemo, useState, useCallback } from 'react';
import { PIE_ANIMATION_PROPS, BAR_ANIMATION_PROPS } from '@/lib/chart-animations';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  onRefreshDataset?: (datasetKey: DatasetKey) => void;
}

const cardStyle =
  'bg-[#0f1118] border border-white/5 rounded-2xl p-5 text-white shadow-[0_10px_40px_rgba(15,17,24,0.8)] relative overflow-hidden';

type PieDatasetKey =
  | 'houseOwnership'
  | 'societyDistribution'
  | 'wardDistribution'
  | 'motherTongueDistribution'
  | 'genderDistribution'
  | 'casteDistribution';

type BarDatasetKey = 'professionStats' | 'educationStats' | 'ageDistribution';

type DatasetKey = PieDatasetKey | BarDatasetKey;

type ChartDatum = { label: string; value: number; color: string };

type DatasetMeta = {
  title: string;
  subtitle: string;
  type: 'pie' | 'bar';
  data: ChartDatum[];
};

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

const CardActions = ({
  datasetKey,
  onDataNavigate,
  onRefresh,
}: {
  datasetKey: DatasetKey;
  onDataNavigate: (key: DatasetKey) => void;
  onRefresh?: (key: DatasetKey) => void;
}) => (
  <div className="flex items-center gap-2">
    <Button
      type="button"
      variant="outline"
      className="bg-[#1f2331] border-white/10 text-white hover:bg-[#202638]"
      onClick={() => onDataNavigate(datasetKey)}
    >
      Data
    </Button>
    {onRefresh && (
      <button
        type="button"
        className="p-2 rounded-lg bg-[#1c1f2b] border border-white/10 hover:bg-[#24283a]"
        aria-label="Refresh"
        onClick={() => onRefresh(datasetKey)}
      >
        <RefreshCw className="w-4 h-4 text-white" />
      </button>
    )}
  </div>
);

type PieCardProps = {
  datasetKey: PieDatasetKey;
  title: string;
  subtitle: string;
  data: PieSlice[];
  onDataNavigate: (key: DatasetKey) => void;
  onRefresh?: (key: DatasetKey) => void;
};

const PieCard = ({ datasetKey, title, subtitle, data, onDataNavigate, onRefresh }: PieCardProps) => {
  const total = useMemo(() => data.reduce((sum, slice) => sum + slice.value, 0), [data]);
  const hasData = data.length > 0 && total > 0;

  return (
    <section className={cardStyle}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <ChartHeader title={title} subtitle={subtitle} legend={data} />
        <CardActions datasetKey={datasetKey} onDataNavigate={onDataNavigate} onRefresh={onRefresh} />
      </div>
      <div className="h-72 mt-6">
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-white/60 border border-white/10 rounded-2xl">
            Awaiting data for this segment
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={120}
              labelLine={false}
              {...PIE_ANIMATION_PROPS}
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
              formatter={(value: number, name: string) => {
                const numericValue = Number(value) || 0;
                const percentage = total ? ((numericValue / total) * 100).toFixed(1) : '0.0';
                return [`${numericValue.toLocaleString()} (${percentage}%)`, name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

type BarCardProps = {
  datasetKey: BarDatasetKey;
  title: string;
  subtitle: string;
  data: BarStat[];
  barColor: string;
  onDataNavigate: (key: DatasetKey) => void;
  onRefresh?: (key: DatasetKey) => void;
};

const BarCard = ({ datasetKey, title, subtitle, data, barColor, onDataNavigate, onRefresh }: BarCardProps) => {
  const total = useMemo(() => data.reduce((sum, slice) => sum + slice.value, 0), [data]);
  const hasData = data.length > 0 && total > 0;

  return (
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
        <CardActions datasetKey={datasetKey} onDataNavigate={onDataNavigate} onRefresh={onRefresh} />
      </div>

      <div className="h-72 mt-6">
        {!hasData ? (
          <div className="flex h-full items-center justify-center text-sm text-white/60 border border-white/10 rounded-2xl">
            Awaiting data for this segment
          </div>
        ) : (
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
              formatter={(value: number) => {
                const numericValue = Number(value) || 0;
                const percentage = total ? ((numericValue / total) * 100).toFixed(1) : '0.0';
                return [`${numericValue.toLocaleString()} (${percentage}%)`, 'Count'];
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={barColor} {...BAR_ANIMATION_PROPS} />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </section>
  );
};

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
  onRefreshDataset,
}: DataInsightPanelProps) => {
  const casteSlices = useMemo<PieSlice[]>(
    () => casteDistribution.map((item) => ({ label: item.name, value: item.value, color: item.color })),
    [casteDistribution]
  );
  const datasetMeta = useMemo<Record<DatasetKey, DatasetMeta>>(
    () => ({
      houseOwnership: { title: 'House', subtitle: 'House (Own / Rent / Lease)', type: 'pie', data: houseOwnership },
      societyDistribution: { title: 'Society', subtitle: 'Society Participation', type: 'pie', data: societyDistribution },
      wardDistribution: { title: 'Ward No', subtitle: 'Ward Distribution', type: 'pie', data: wardDistribution },
      motherTongueDistribution: { title: 'Mother Tongue', subtitle: 'Language Preference', type: 'pie', data: motherTongueDistribution },
      genderDistribution: { title: 'Gender', subtitle: 'Gender Overview', type: 'pie', data: genderDistribution },
      casteDistribution: { title: 'Caste', subtitle: 'Community Split', type: 'pie', data: casteSlices },
      professionStats: { title: 'Profession', subtitle: 'Profession', type: 'bar', data: professionStats },
      educationStats: { title: 'Education', subtitle: 'Education', type: 'bar', data: educationStats },
      ageDistribution: { title: 'Age', subtitle: 'Age Range', type: 'bar', data: ageDistribution },
    }),
    [
      ageDistribution,
      casteSlices,
      educationStats,
      genderDistribution,
      houseOwnership,
      motherTongueDistribution,
      professionStats,
      societyDistribution,
      wardDistribution,
    ]
  );
  const [activeDatasetKey, setActiveDatasetKey] = useState<DatasetKey | null>(null);

  const handleDataNavigate = useCallback((datasetKey: DatasetKey) => {
    setActiveDatasetKey(datasetKey);
  }, []);

  const handleRefresh = useCallback(
    (datasetKey: DatasetKey) => {
      onRefreshDataset?.(datasetKey);
    },
    [onRefreshDataset]
  );

  const activeDataset = activeDatasetKey ? datasetMeta[activeDatasetKey] : null;
  const activeTotal = activeDataset ? activeDataset.data.reduce((sum, item) => sum + item.value, 0) : 0;

  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <PieCard
            datasetKey="houseOwnership"
            title="House"
            subtitle="House (Own / Rent / Lease)"
            data={houseOwnership}
            onDataNavigate={handleDataNavigate}
            onRefresh={handleRefresh}
          />
          <PieCard
            datasetKey="societyDistribution"
            title="Society"
            subtitle="Society Participation"
            data={societyDistribution}
            onDataNavigate={handleDataNavigate}
            onRefresh={handleRefresh}
          />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <PieCard
            datasetKey="wardDistribution"
            title="Ward No"
            subtitle="Ward Distribution"
            data={wardDistribution}
            onDataNavigate={handleDataNavigate}
            onRefresh={handleRefresh}
          />
          <PieCard
            datasetKey="motherTongueDistribution"
            title="Mother Tongue"
            subtitle="Language Preference"
            data={motherTongueDistribution}
            onDataNavigate={handleDataNavigate}
            onRefresh={handleRefresh}
          />
        </div>
      </div>
      <Dialog open={Boolean(activeDataset)} onOpenChange={(open) => !open && setActiveDatasetKey(null)}>
        {activeDataset && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{activeDataset.title} data</DialogTitle>
              <DialogDescription>{activeDataset.subtitle}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total records</span>
              <span className="font-semibold text-foreground">{activeTotal.toLocaleString()}</span>
            </div>
            <ScrollArea className="mt-4 max-h-[320px] pr-4">
              <div className="space-y-3">
                {activeDataset.data.map((item) => {
                  const percentage = activeTotal ? ((item.value / activeTotal) * 100).toFixed(1) : '0.0';
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-border bg-muted px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{percentage}% of total</p>
                      </div>
                      <p className="font-semibold text-foreground">{item.value.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default DataInsightPanel;
