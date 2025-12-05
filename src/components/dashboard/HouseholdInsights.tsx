import { HouseholdInsight } from '@/types/election';
import { Home, Users } from 'lucide-react';

interface HouseholdInsightsProps {
  insights: HouseholdInsight[];
}

const HouseholdInsights = ({ insights }: HouseholdInsightsProps) => {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {insights.map((item) => (
        <div key={item.id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Society</p>
            <h3 className="text-xl font-semibold text-foreground">{item.society}</h3>
            <p className="text-sm text-muted-foreground">{item.address}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-stat-blue">
              <Home className="w-5 h-5" />
              <div>
                <p className="text-2xl font-semibold">{item.households}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Households</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-stat-green">
              <Users className="w-5 h-5" />
              <div>
                <p className="text-2xl font-semibold">{item.voterCount}</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Registered voters</p>
              </div>
            </div>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Coordinator</p>
            <p className="font-medium">{item.coordinator}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default HouseholdInsights;
