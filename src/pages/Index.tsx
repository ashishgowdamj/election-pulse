import { useMemo, useState } from 'react';
import { Building2 } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import SuperInsightChart from '@/components/dashboard/SuperInsightChart';
import VoterTable from '@/components/dashboard/VoterTable';
import FilterBar, { FilterValues, defaultFilterOptions, FilterOption } from '@/components/dashboard/FilterBar';
import { toast } from '@/hooks/use-toast';
import GenderOverviewPanel from '@/components/dashboard/GenderOverviewPanel';
import WardBarChart from '@/components/dashboard/WardBarChart';
import MiniCasteChart from '@/components/dashboard/MiniCasteChart';
import MiniLanguageChart from '@/components/dashboard/MiniLanguageChart';
import MiniAgeChart from '@/components/dashboard/MiniAgeChart';
import { useCasteBreakdown, useDashboardStats, useGenderAreaBreakdown, useVoters } from '@/hooks/use-dashboard-data';
import type { VoterStats } from '@/types/election';
import { buildInsightData } from '@/lib/insight-builder';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'individual';

const mergeOptions = (defaults: FilterOption[], extras: FilterOption[]) => {
  const seen = new Set(defaults.map((option) => option.value));
  const merged = [...defaults];
  extras.forEach((option) => {
    if (option.value && !seen.has(option.value)) {
      merged.push(option);
      seen.add(option.value);
    }
  });
  return merged;
};

const initialFilters: FilterValues = {
  search: '',
  ward: [],
  booth: [],
  gender: [],
  caste: [],
  ageGroup: [],
  motherTongue: [],
  voterType: [],
  pollingStation: [],
  society: [],
  hasRationCard: [],
  hasComplaint: [],
};

const emptyStats: VoterStats = {
  totalVoters: 0,
  maleVoters: 0,
  femaleVoters: 0,
  otherVoters: 0,
  youthVoters: 0,
  duplicateVoters: 0,
  voterCountOnHouse: 0,
  totalBooth: 0,
  totalEvent: 0,
};

const Index = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [filters, setFilters] = useState<FilterValues>({ ...initialFilters });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const statsQuery = useDashboardStats(filters);
  const casteQuery = useCasteBreakdown(filters);
  const genderQuery = useGenderAreaBreakdown(filters);
  const voterQuery = useVoters(filters);
  const overallStatsQuery = useDashboardStats(initialFilters);
  const overallVoterQuery = useVoters(initialFilters);
  const voters = voterQuery.data?.data ?? [];
  const heroVoters = overallVoterQuery.data?.data ?? [];
  const totalVoterCount = voterQuery.data?.total ?? voters.length;

  const filterOptionOverrides = useMemo(() => {
    const wardMap = new Map<string, string>();
    const casteMap = new Map<string, string>();
    const genderMap = new Map<string, string>();
    const languageMap = new Map<string, string>();
    const societyMap = new Map<string, string>();
    const boothMap = new Map<string, string>();
    const stationMap = new Map<string, string>();

    voters.forEach((voter) => {
      if (voter.wardNo && !wardMap.has(voter.wardNo)) {
        const label = voter.wardName
          ? `${voter.wardName} (Ward ${voter.wardNo})`
          : `Ward ${voter.wardNo}`;
        wardMap.set(voter.wardNo, label);
      }

      if (voter.caste) {
        const normalized = voter.caste.toLowerCase();
        if (!casteMap.has(normalized)) {
          casteMap.set(normalized, voter.caste);
        }
      }

      if (voter.gender) {
        const normalized = voter.gender.toLowerCase();
        if (!genderMap.has(normalized)) {
          genderMap.set(normalized, voter.gender);
        }
      }

      if (voter.motherTongue) {
        const normalized = voter.motherTongue.toLowerCase();
        if (!languageMap.has(normalized)) {
          languageMap.set(normalized, voter.motherTongue);
        }
      }

      if (voter.societyName) {
        const slug = slugify(voter.societyName);
        if (!societyMap.has(slug)) {
          societyMap.set(slug, voter.societyName);
        }
      }

      if (voter.boothNo || voter.boothName) {
        const boothValue = voter.boothNo ?? voter.boothName!;
        if (!boothMap.has(boothValue)) {
          boothMap.set(boothValue, boothValue.startsWith('Booth') ? boothValue : `Booth ${boothValue}`);
        }
      }

      if (voter.pollingStation) {
        const slug = slugify(voter.pollingStation);
        if (!stationMap.has(slug)) {
          stationMap.set(slug, voter.pollingStation);
        }
      }
    });

    const mapToOptions = (map: Map<string, string>): FilterOption[] =>
      Array.from(map.entries()).map(([value, label]) => ({ value, label }));

    return {
      ward: mergeOptions(defaultFilterOptions.ward, mapToOptions(wardMap)),
      caste: mergeOptions(defaultFilterOptions.caste, mapToOptions(casteMap)),
      gender: mergeOptions(defaultFilterOptions.gender, mapToOptions(genderMap)),
      motherTongue: mergeOptions(
        defaultFilterOptions.motherTongue,
        mapToOptions(languageMap)
      ),
      society: mergeOptions(defaultFilterOptions.society, mapToOptions(societyMap)),
      booth: mergeOptions(defaultFilterOptions.booth, mapToOptions(boothMap)),
      pollingStation: mergeOptions(defaultFilterOptions.pollingStation, mapToOptions(stationMap)),
    } as Partial<typeof defaultFilterOptions>;
  }, [voters]);

  const statsDisplay = statsQuery.data ?? emptyStats;
  const heroStatsDisplay = overallStatsQuery.data ?? emptyStats;
  const casteDataForCharts = casteQuery.data ?? [];
  const genderDataForCharts = genderQuery.data ?? [];
  const insightData = useMemo(() => buildInsightData(voters, statsDisplay), [voters, statsDisplay]);
  const heroInsightData = useMemo(() => buildInsightData(heroVoters, heroStatsDisplay), [heroVoters, heroStatsDisplay]);
  const casteDistributionForInsights = casteDataForCharts.length > 0 ? casteDataForCharts : insightData.casteBreakdown;
  const hasVoterData = voters.length > 0;
  const isFetching =
    statsQuery.isFetching || casteQuery.isFetching || genderQuery.isFetching || voterQuery.isFetching;

  const wardCount = useMemo(() => {
    const unique = new Set(voters.map((voter) => voter.wardNo).filter(Boolean));
    if (unique.size > 0) {
      return unique.size;
    }
    return statsDisplay.totalBooth;
  }, [voters, statsDisplay.totalBooth]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    toast({
      title: 'Filters Applied',
      description: 'Dashboard data has been filtered.',
    });
  };

  const handleClearFilters = () => {
    setFilters({ ...initialFilters });
    toast({
      title: 'Filters Cleared',
      description: 'All filters have been reset.',
    });
  };

  const handleRefresh = async (section: string) => {
    toast({
      title: 'Refreshing Data',
      description: `Updating ${section} statistics...`,
    });
    try {
      await Promise.all([
        statsQuery.refetch(),
        casteQuery.refetch(),
        genderQuery.refetch(),
        voterQuery.refetch(),
      ]);
      toast({
        title: 'Data Updated',
        description: `${section} statistics refreshed successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Refresh Failed',
        description: error instanceof Error ? error.message : 'Unable to pull latest data.',
        variant: 'destructive',
      });
    }

    const handleHeroRefresh = async (section: string) => {
      toast({
        title: 'Refreshing Data',
        description: `Updating ${section} statistics...`,
      });
      try {
        await Promise.all([overallStatsQuery.refetch(), overallVoterQuery.refetch()]);
        toast({
          title: 'Data Updated',
          description: `${section} statistics refreshed successfully.`,
        });
      } catch (error) {
        toast({
          title: 'Refresh Failed',
          description: error instanceof Error ? error.message : 'Unable to pull latest data.',
          variant: 'destructive',
        });
      }
    };
  };

  const filterControls = (
    <FilterBar
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      optionOverrides={filterOptionOverrides}
    />
  );

  const renderDashboard = () => (
    <>
      <div className="grid gap-3 w-full lg:grid-cols-2 xl:grid-cols-4">
        <div className="h-full">
          <WardBarChart
            data={heroInsightData.wardDistribution}
            onRefresh={() => handleHeroRefresh('ward distribution')}
          />
        </div>
        <div className="h-full">
          <MiniCasteChart
            data={heroInsightData.casteBreakdown}
            onRefresh={() => handleHeroRefresh('caste distribution')}
          />
        </div>
        <div className="h-full">
          <MiniLanguageChart
            data={heroInsightData.motherTongueDistribution}
            onRefresh={() => handleHeroRefresh('language distribution')}
          />
        </div>
        <div className="h-full">
          <MiniAgeChart
            data={heroInsightData.ageDistribution}
            onRefresh={() => handleHeroRefresh('age distribution')}
          />
        </div>
      </div>

      <div className="mt-3">{filterControls}</div>

      <section className="mt-6">
        <SuperInsightChart
          data={casteDistributionForInsights}
          onRefresh={() => handleRefresh('insight spotlight')}
          title="Constituency Composition"
          description="Dive into filtered caste distribution using pie, donut, bar, area, or radar views. Switch chart types to compare how each community contributes."
        />
      </section>

    </>
  );

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'live-voters':
        return (
          <>
            {filterControls}
            <VoterTable voters={voters} title="Voters Data" />
            <div className="mt-4 text-sm text-muted-foreground text-center">
              {hasVoterData ? (
                <span>
                  Showing {voters.length} of {totalVoterCount} voters based on applied filters
                  {isFetching ? ' — refreshing…' : ''}
                </span>
              ) : (
                <span>No voter records were returned for the selected filters.</span>
              )}
            </div>
          </>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex min-h-screen bg-transparent">
      <Sidebar
        activeItem={activeMenuItem}
        onItemClick={setActiveMenuItem}
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
      />
      <div className="flex-1 flex flex-col bg-transparent">
        <header className="relative bg-white border-b border-border shadow-sm overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <img
              src="/header-watermark-arch.png"
              alt="Arch motif"
              className="w-full h-full object-cover opacity-[0.5]"
              aria-hidden="true"
            />
          </div>
          <div className="relative z-10 flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="w-32 h-32 rounded-full overflow-hidden border border-border shadow-md">
                <img
                  src="/munirathna-header-left.jpeg"
                  alt="Munirathna"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-center">
              <p className="text-5xl font-black tracking-[0.25em] uppercase text-foreground [text-shadow:_0_0_12px_rgba(255,165,0,0.45)]">
                Man of Humanity
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="w-32 h-32 rounded-full overflow-hidden border border-border shadow-md">
                <img
                  src="/bjp-header-right.jpeg"
                  alt="BJP Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {activeMenuItem === 'dashboard' && (
          <section className="px-6 pt-2 pb-1 mt-1">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                value={statsDisplay.totalVoters}
                label="Total Voter"
                variant="orange"
                icon={
                  <img
                    src="/stat-total-voters.png"
                    alt="Total voters"
                    className="w-[3.81rem] h-[3.81rem] rounded-full object-cover border-2 border-white/50 shadow-md scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                }
                onRefresh={() => handleRefresh('total voters')}
              />
              <StatCard
                value={statsDisplay.maleVoters}
                label="Male Voter"
                variant="blue"
                icon={
                  <img
                    src="/stat-male-voters.png"
                    alt="Male voters"
                    className="w-[3.81rem] h-[3.81rem] rounded-full object-cover border-2 border-white/50 shadow-md scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                }
                onRefresh={() => handleRefresh('male voters')}
              />
              <StatCard
                value={statsDisplay.femaleVoters}
                label="Female Voter"
                variant="green"
                icon={
                  <img
                    src="/stat-female-voters.png"
                    alt="Female voters"
                    className="w-[3.81rem] h-[3.81rem] rounded-full object-cover border-2 border-white/50 shadow-md scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                }
                onRefresh={() => handleRefresh('female voters')}
              />
              <StatCard
                value={wardCount}
                label="Total Ward"
                variant="teal"
                icon={<Building2 className="w-8 h-8 opacity-90" />}
                onRefresh={() => handleRefresh('ward count')}
              />
            </div>
          </section>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6 pt-2 space-y-3 mt-0">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
