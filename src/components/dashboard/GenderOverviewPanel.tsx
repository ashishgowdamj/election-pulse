import { GenderBoothData, VoterStats } from '@/types/election';
import GenderBoothChart from './GenderBoothChart';

interface GenderOverviewPanelProps {
  data: GenderBoothData[];
  stats: VoterStats;
}

const GenderOverviewPanel = ({ data, stats }: GenderOverviewPanelProps) => {
  const total = stats.maleVoters + stats.femaleVoters + stats.otherVoters;

  const safePercent = (value: number) => {
    if (!total) return '0.0';
    return ((value / total) * 100).toFixed(1);
  };

  const cards = [
    {
      label: 'Male Voters',
      value: stats.maleVoters,
      percentage: safePercent(stats.maleVoters),
      color: 'bg-stat-blue/15 text-stat-blue',
    },
    {
      label: 'Female Voters',
      value: stats.femaleVoters,
      percentage: safePercent(stats.femaleVoters),
      color: 'bg-stat-green/15 text-stat-green',
    },
    {
      label: 'Other Voters',
      value: stats.otherVoters,
      percentage: safePercent(stats.otherVoters),
      color: 'bg-stat-orange/15 text-stat-orange',
    },
  ];

  return (
    <section className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-3xl font-semibold">{card.value.toLocaleString()}</p>
            <span className={`inline-flex px-3 py-1 rounded-full text-xs mt-2 ${card.color}`}>
              {card.percentage}% of total
            </span>
          </div>
        ))}
      </div>
      <GenderBoothChart data={data} />
    </section>
  );
};

export default GenderOverviewPanel;
