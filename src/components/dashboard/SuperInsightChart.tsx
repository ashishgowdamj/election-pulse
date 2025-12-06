import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
} from 'recharts';
import { RefreshCw, ChevronDown, Layers3, BarChart3, Filter } from 'lucide-react';
import { PIE_ANIMATION_PROPS, BAR_ANIMATION_PROPS } from '@/lib/chart-animations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const chartOptions = [
  { id: 'pie', label: 'Pie' },
  { id: 'donut', label: 'Donut' },
  { id: 'bar', label: 'Bar' },
  { id: 'stackedBar', label: 'Stacked Bar' },
  { id: 'area', label: 'Area' },
  { id: 'line', label: 'Line' },
  { id: 'radar', label: 'Radar' },
] as const;

const fallbackColors = ['#2563eb', '#a855f7', '#10b981', '#f97316', '#0ea5e9', '#f43f5e'];

export type ChartView = (typeof chartOptions)[number]['id'];

export interface InsightSegment {
  label: string;
  value: number;
  color?: string;
}

export interface InsightDataset {
  id: string;
  label: string;
  description: string;
  segments: InsightSegment[];
}

interface SuperInsightChartProps {
  title?: string;
  description?: string;
  datasets: InsightDataset[];
  onRefresh?: () => Promise<void> | void;
}

const SuperInsightChart = ({
  title = 'Dynamic Insight',
  description = 'Explore caste, language and other splits using your preferred chart style.',
  datasets,
  onRefresh,
}: SuperInsightChartProps) => {
  const [chartType, setChartType] = useState<ChartView>('pie');
  const [selectedDatasetId, setSelectedDatasetId] = useState(() => datasets[0]?.id ?? '');
  const [focusedSegments, setFocusedSegments] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!datasets.length) {
      setSelectedDatasetId('');
      setFocusedSegments([]);
      return;
    }
    setSelectedDatasetId((current) => {
      if (current && datasets.some((dataset) => dataset.id === current)) {
        return current;
      }
      return datasets[0].id;
    });
  }, [datasets]);

  useEffect(() => {
    setFocusedSegments([]);
  }, [selectedDatasetId]);

  const activeDataset = useMemo(() => {
    if (!datasets.length) return undefined;
    return datasets.find((dataset) => dataset.id === selectedDatasetId) ?? datasets[0];
  }, [datasets, selectedDatasetId]);

  const normalizedData = useMemo(() => {
    if (!activeDataset) return [];
    const focusSet = new Set(focusedSegments);
    const baseSegments =
      focusedSegments.length > 0
        ? activeDataset.segments.filter((segment) => focusSet.has(segment.label))
        : activeDataset.segments;
    return baseSegments.map((segment, index) => ({
      label: segment.label,
      value: segment.value,
      color: segment.color ?? fallbackColors[index % fallbackColors.length],
    }));
  }, [activeDataset, focusedSegments]);

  const total = normalizedData.reduce((sum, slice) => sum + slice.value, 0);
  const topSegments = useMemo(
    () => [...normalizedData].sort((a, b) => b.value - a.value).slice(0, 10),
    [normalizedData]
  );

  const handleSegmentFocusChange = (segmentLabel: string, nextChecked: boolean) => {
    setFocusedSegments((previous) => {
      const result = new Set(previous);
      if (nextChecked) {
        result.add(segmentLabel);
      } else {
        result.delete(segmentLabel);
      }
      return Array.from(result);
    });
  };

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    try {
      setIsRefreshing(true);
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const activeDescription = activeDataset?.description ?? description;
  const datasetButtonLabel = activeDataset?.label ?? 'Select view';
  const focusButtonLabel = focusedSegments.length ? `${focusedSegments.length} focused` : 'All segments';

  const chartContent = () => {
    if (!normalizedData.length || !total) {
      return (
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground border border-dashed border-border rounded-2xl">
          No {activeDataset?.label?.toLowerCase() ?? 'insight'} data available for current filters.
        </div>
      );
    }

    const chartData = normalizedData;

    switch (chartType) {
      case 'donut':
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={chartType === 'donut' ? 110 : 0}
                outerRadius={chartType === 'donut' ? 170 : 190}
                paddingAngle={2}
                strokeWidth={0}
                {...PIE_ANIMATION_PROPS}
              >
                {chartData.map((slice) => (
                  <Cell key={slice.label} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                formatter={(value: number, name: string) => [`${Number(value).toLocaleString()} voters`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 12, right: 20, bottom: 20, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                formatter={(value: number) => [`${Number(value).toLocaleString()} voters`, 'Count']}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(var(--stat-blue))" {...BAR_ANIMATION_PROPS} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'stackedBar': {
        const stackedData = chartData.map((slice) => ({
          label: slice.label,
          value: slice.value,
          secondary: Math.round(slice.value * 0.35),
        }));
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackedData} margin={{ top: 12, right: 20, bottom: 20, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                formatter={(value: number) => [`${Number(value).toLocaleString()} voters`, 'Count']}
              />
              <Bar
                dataKey="value"
                stackId="a"
                radius={[6, 6, 0, 0]}
                fill="hsl(var(--stat-blue))"
                {...BAR_ANIMATION_PROPS}
              />
              <Bar dataKey="secondary" stackId="a" fill="#a855f7" {...BAR_ANIMATION_PROPS} />
            </BarChart>
          </ResponsiveContainer>
        );
      }
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 12, right: 16, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="insightArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--stat-green))" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="hsl(var(--stat-green))" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                interval={0}
                angle={-25}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                formatter={(value: number) => [`${Number(value).toLocaleString()} voters`, 'Count']}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--stat-green))" fill="url(#insightArea)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 12, right: 16, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                angle={-25}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                formatter={(value: number) => [`${Number(value).toLocaleString()} voters`, 'Count']}
              />
              <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} outerRadius="80%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="label" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <PolarRadiusAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} stroke="hsl(var(--border))" />
              <Radar
                name="Segments"
                dataKey="value"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.45}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                formatter={(value: number, name: string) => [`${Number(value).toLocaleString()} voters`, name]}
              />
            </RadarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <section className="bg-card border border-border rounded-3xl p-8 shadow-[0_25px_90px_rgba(15,18,36,0.3)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="uppercase tracking-[0.3em] text-xs text-muted-foreground">Insight spotlight</p>
          <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">{activeDescription}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
                disabled={!datasets.length}
              >
                <BarChart3 className="h-4 w-4" />
                <span>{datasetButtonLabel}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {datasets.length === 0 && <DropdownMenuItem disabled>No datasets available</DropdownMenuItem>}
              {datasets.map((dataset) => (
                <DropdownMenuItem
                  key={dataset.id}
                  className={`flex items-center justify-between ${activeDataset?.id === dataset.id ? 'text-foreground font-medium' : ''}`}
                  onClick={() => setSelectedDatasetId(dataset.id)}
                >
                  <span>{dataset.label}</span>
                  {activeDataset?.id === dataset.id && (
                    <span className="text-xs text-muted-foreground">(active)</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
                disabled={!activeDataset || activeDataset.segments.length === 0}
              >
                <Filter className="h-4 w-4" />
                <span>{focusButtonLabel}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-72 overflow-y-auto">
              <DropdownMenuItem onClick={() => setFocusedSegments([])} disabled={!focusedSegments.length}>
                Show all segments
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {activeDataset?.segments.map((segment) => (
                <DropdownMenuCheckboxItem
                  key={segment.label}
                  checked={focusedSegments.includes(segment.label)}
                  onCheckedChange={(checked) => handleSegmentFocusChange(segment.label, Boolean(checked))}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color ?? '#94a3b8' }} />
                    <span className="truncate">{segment.label}</span>
                  </span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5"
              >
                <Layers3 className="h-4 w-4" />
                <span>{chartOptions.find((option) => option.id === chartType)?.label ?? 'Chart Type'}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {chartOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  className={`flex items-center justify-between ${chartType === option.id ? 'text-foreground font-medium' : ''}`}
                  onClick={() => setChartType(option.id)}
                >
                  <span>{option.label}</span>
                  {chartType === option.id && <span className="text-xs text-muted-foreground">(active)</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {onRefresh && (
            <button
              type="button"
              onClick={handleRefresh}
              className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              aria-busy={isRefreshing}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
        <div className="min-h-[520px] h-[520px]">{chartContent()}</div>
        <div className="space-y-4 lg:-mt-4">
          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">Total</p>
            <p className="text-4xl font-semibold text-foreground mt-1">{total.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">records represented</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/20 p-4 h-[320px] overflow-y-auto">
            <p className="text-sm font-medium text-foreground mb-3">Top segments</p>
            <div className="space-y-3">
              {topSegments.map((slice) => {
                const percentage = total ? ((slice.value / total) * 100).toFixed(1) : '0.0';
                return (
                  <div key={slice.label} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
                      <span className="text-sm text-muted-foreground truncate">{slice.label}</span>
                    </div>
                    <span className="text-sm text-foreground whitespace-nowrap">
                      {slice.value.toLocaleString()} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuperInsightChart;
