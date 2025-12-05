import { useMemo, useState } from 'react';
import { Users, User, UserCircle2, HelpCircle, Home, Copy, Building2, Calendar } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import SideStatCard from '@/components/dashboard/SideStatCard';
import CasteWiseChart from '@/components/dashboard/CasteWiseChart';
import VoterTable from '@/components/dashboard/VoterTable';
import FilterBar, { FilterValues, defaultFilterOptions, FilterOption } from '@/components/dashboard/FilterBar';
import {
  voterStats,
  casteData,
  genderBoothData,
  sampleVoters,
  bloDirectory,
  duplicateHouseholds,
  householdInsights,
  pollingStations,
  campaignEvents,
  communicationGroups,
  messageTemplates,
  houseOwnership,
  societyDistribution,
  wardDistribution,
  professionStats,
  educationStats,
  motherTongueDistribution,
  genderDistribution as genderPieDistribution,
  ageDistribution,
} from '@/data/mockElectionData';
import { toast } from '@/hooks/use-toast';
import SearchVoterPanel from '@/components/dashboard/SearchVoterPanel';
import BloDirectory from '@/components/dashboard/BloDirectory';
import DuplicateVoterPanel from '@/components/dashboard/DuplicateVoterPanel';
import GenderOverviewPanel from '@/components/dashboard/GenderOverviewPanel';
import HouseholdInsights from '@/components/dashboard/HouseholdInsights';
import PollingStationList from '@/components/dashboard/PollingStationList';
import CommunicationPanel from '@/components/dashboard/CommunicationPanel';
import EventTimeline from '@/components/dashboard/EventTimeline';
import DataInsightPanel from '@/components/dashboard/DataInsightPanel';
import {
  useCasteBreakdown,
  useDashboardStats,
  useGenderAreaBreakdown,
  useVoters,
} from '@/hooks/use-dashboard-data';

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

const Index = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [filters, setFilters] = useState<FilterValues>({ ...initialFilters });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const statsQuery = useDashboardStats(filters);
  const casteQuery = useCasteBreakdown(filters);
  const genderQuery = useGenderAreaBreakdown(filters);
  const voterQuery = useVoters(filters);

  const filteredSampleVoters = useMemo(() => {
    return sampleVoters.filter((voter) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          voter.name.toLowerCase().includes(searchLower) ||
          voter.voterId.toLowerCase().includes(searchLower) ||
          voter.phoneNo?.toLowerCase().includes(searchLower) ||
          voter.newAddress.toLowerCase().includes(searchLower) ||
          voter.cardNo.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.ward.length && !filters.ward.includes(voter.wardNo)) {
        return false;
      }

      if (filters.booth.length) {
        const boothValue = voter.boothNo ?? voter.boothName ?? (voter as { booth?: string }).booth;
        if (!boothValue || !filters.booth.includes(String(boothValue))) {
          return false;
        }
      }

      if (filters.gender.length && !filters.gender.includes(voter.gender.toLowerCase())) {
        return false;
      }

      if (filters.caste.length && (!voter.caste || !filters.caste.includes(voter.caste.toLowerCase()))) {
        return false;
      }

      if (filters.ageGroup.length) {
        const age = voter.age;
        const matchesAgeGroup = filters.ageGroup.some((range) => {
          switch (range) {
            case '18-25':
              return age >= 18 && age <= 25;
            case '26-35':
              return age >= 26 && age <= 35;
            case '36-45':
              return age >= 36 && age <= 45;
            case '46-55':
              return age >= 46 && age <= 55;
            case '56-65':
              return age >= 56 && age <= 65;
            case '65+':
              return age >= 65;
            default:
              return true;
          }
        });
        if (!matchesAgeGroup) return false;
      }

      if (
        filters.motherTongue.length &&
        (!voter.motherTongue || !filters.motherTongue.includes(voter.motherTongue.toLowerCase()))
      ) {
        return false;
      }

      if (filters.hasRationCard.length) {
        const hasCard = !!voter.rationCardNo;
        if (hasCard && !filters.hasRationCard.includes('yes')) return false;
        if (!hasCard && !filters.hasRationCard.includes('no')) return false;
      }

      if (filters.hasComplaint.length) {
        const hasComplaint = !!voter.complaint;
        if (hasComplaint && !filters.hasComplaint.includes('yes')) return false;
        if (!hasComplaint && !filters.hasComplaint.includes('no')) return false;
      }

      if (filters.society.length) {
        const societySlug = voter.societyName ? slugify(voter.societyName) : 'individual';
        if (!filters.society.includes(societySlug)) {
          return false;
        }
      }

      if (filters.pollingStation.length) {
        const stationSlug = voter.pollingStation ? slugify(voter.pollingStation) : undefined;
        if (!stationSlug || !filters.pollingStation.includes(stationSlug)) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  const hasLiveVoters =
    Boolean(voterQuery.data?.data && voterQuery.data.data.length > 0);

  const votersForOptions = useMemo(
    () => (hasLiveVoters ? voterQuery.data?.data ?? [] : sampleVoters),
    [hasLiveVoters, voterQuery.data]
  );

  const filterOptionOverrides = useMemo(() => {
    const wardMap = new Map<string, string>();
    const casteMap = new Map<string, string>();
    const genderMap = new Map<string, string>();
    const languageMap = new Map<string, string>();
    const societyMap = new Map<string, string>();
    const boothMap = new Map<string, string>();
    const stationMap = new Map<string, string>();

    votersForOptions.forEach((voter) => {
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
  }, [votersForOptions]);

  const fallbackStats = useMemo(() => {
    const total = filteredSampleVoters.length;
    if (!sampleVoters.length) {
      return voterStats;
    }
    const ratio = total / sampleVoters.length;
    return {
      ...voterStats,
      totalVoters: Math.round(voterStats.totalVoters * ratio),
      maleVoters: Math.round(voterStats.maleVoters * ratio),
      femaleVoters: Math.round(voterStats.femaleVoters * ratio),
      otherVoters: Math.round(voterStats.otherVoters * ratio),
      youthVoters: Math.round(voterStats.youthVoters * ratio),
      duplicateVoters: Math.round(voterStats.duplicateVoters * ratio),
      voterCountOnHouse: Math.round(voterStats.voterCountOnHouse * ratio),
      totalBooth: voterStats.totalBooth,
      totalEvent: voterStats.totalEvent,
    };
  }, [filteredSampleVoters]);

  const statsDisplay = statsQuery.data ?? fallbackStats;
  const casteDataForCharts = casteQuery.data ?? casteData;
  const genderDataForCharts = genderQuery.data ?? genderBoothData;
  const voters = hasLiveVoters ? voterQuery.data?.data ?? [] : filteredSampleVoters;
  const totalVoterCount = hasLiveVoters ? voterQuery.data?.total ?? 0 : sampleVoters.length;
  const isFetching =
    statsQuery.isFetching || casteQuery.isFetching || genderQuery.isFetching || voterQuery.isFetching;

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
  };

  const sectionMeta: Record<string, { label: string; title: string }> = {
    dashboard: {
      label: 'Real-time Monitoring',
      title: 'Election Management Dashboard',
    },
    'search-voter': {
      label: 'Citizen Lookup',
      title: 'Search Voter Records',
    },
    'search-blo': {
      label: 'Team Operations',
      title: 'Booth Level Officer Directory',
    },
    'duplicate-voters': {
      label: 'Data Hygiene',
      title: 'Duplicate Voter Alerts',
    },
    'voter-gender': {
      label: 'Demographic Insights',
      title: 'Gender & Booth Analysis',
    },
    'voter-house': {
      label: 'Society Level View',
      title: 'Household Voter Count',
    },
    'polling-station': {
      label: 'Logistics Overview',
      title: 'Polling Station List',
    },
    'send-sms': {
      label: 'Communication Suite',
      title: 'Send SMS Broadcast',
    },
    'send-mail': {
      label: 'Communication Suite',
      title: 'Send Email Broadcast',
    },
    'event-list': {
      label: 'Field Coordination',
      title: 'Campaign Events & Rallies',
    },
  };

  const activeSection = sectionMeta[activeMenuItem] ?? sectionMeta.dashboard;

  const renderDashboard = () => (
    <>
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              optionOverrides={filterOptionOverrides}
            />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 mt-6">
        <StatCard
          value={statsDisplay.totalVoters}
          label="Total Voter"
          variant="red"
          icon={<Users className="w-8 h-8" />}
          onRefresh={() => handleRefresh('totalVoters')}
        />
        <StatCard
          value={statsDisplay.maleVoters}
          label="Male Voter"
          variant="blue"
          icon={<User className="w-8 h-8" />}
          onRefresh={() => handleRefresh('maleVoters')}
        />
        <StatCard
          value={statsDisplay.femaleVoters}
          label="Female Voter"
          variant="green"
          icon={<UserCircle2 className="w-8 h-8" />}
          onRefresh={() => handleRefresh('femaleVoters')}
        />
        <StatCard
          value={statsDisplay.otherVoters}
          label="Other Voter"
          variant="orange"
          icon={<HelpCircle className="w-8 h-8" />}
          onRefresh={() => handleRefresh('otherVoters')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 space-y-6">
                <CasteWiseChart data={casteDataForCharts} onRefresh={() => handleRefresh('caste')} />
              </div>

        <div className="space-y-4">
          <SideStatCard
            value={statsDisplay.youthVoters}
            label="Youth Voter"
            icon={<Users className="w-5 h-5" />}
            variant="orange"
          />
          <SideStatCard
            value={statsDisplay.duplicateVoters}
            label="Duplicate Voter"
            icon={<Copy className="w-5 h-5" />}
            variant="red"
          />
          <SideStatCard
            value={statsDisplay.voterCountOnHouse}
            label="Voter Count on House"
            icon={<Home className="w-5 h-5" />}
            variant="teal"
          />
          <SideStatCard
            value={statsDisplay.totalBooth}
            label="Total Booth"
            icon={<Building2 className="w-5 h-5" />}
            variant="yellow"
          />
          <SideStatCard
            value={statsDisplay.totalEvent}
            label="Total Event"
            icon={<Calendar className="w-5 h-5" />}
            variant="green"
          />
        </div>
      </div>

      <VoterTable voters={voters} title={hasLiveVoters ? 'Live Voter Registry' : 'Sample Voter Registry'} />

      <div className="mt-4 text-sm text-muted-foreground text-center">
        {hasLiveVoters ? (
          <span>
            Showing {voters.length} of {totalVoterCount} voters based on applied filters
            {isFetching ? ' — refreshing…' : ''}
          </span>
        ) : (
          <span>Showing {filteredSampleVoters.length} of {sampleVoters.length} voters based on applied filters</span>
        )}
      </div>

      <section className="mt-10 space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.5em] text-muted-foreground">Field Intelligence</p>
          <h2 className="text-2xl font-semibold text-foreground">Constituency Insight Board</h2>
          <p className="text-sm text-muted-foreground">
            Visualize ownership patterns, socio-economic spread, education, age, and language mix similar to the provided reference layouts.
          </p>
        </div>
        <DataInsightPanel
          houseOwnership={houseOwnership}
          societyDistribution={societyDistribution}
          wardDistribution={wardDistribution}
          professionStats={professionStats}
          educationStats={educationStats}
          motherTongueDistribution={motherTongueDistribution}
          genderDistribution={genderPieDistribution}
          ageDistribution={ageDistribution}
          casteDistribution={casteDataForCharts}
        />
      </section>
    </>
  );

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'search-voter':
        return <SearchVoterPanel voters={voters} />;
      case 'search-blo':
        return <BloDirectory officers={bloDirectory} />;
      case 'duplicate-voters':
        return <DuplicateVoterPanel records={duplicateHouseholds} />;
      case 'voter-gender':
        return <GenderOverviewPanel data={genderDataForCharts} stats={statsDisplay} />;
      case 'voter-house':
        return <HouseholdInsights insights={householdInsights} />;
      case 'polling-station':
        return <PollingStationList stations={pollingStations} />;
      case 'send-sms':
        return <CommunicationPanel channel="sms" groups={communicationGroups} templates={messageTemplates} />;
      case 'send-mail':
        return <CommunicationPanel channel="email" groups={communicationGroups} templates={messageTemplates} />;
      case 'event-list':
        return <EventTimeline events={campaignEvents} />;
      case 'dashboard':
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeItem={activeMenuItem}
        onItemClick={setActiveMenuItem}
        collapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 p-6 overflow-auto">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 -mt-2">
          <img
            src="/munirathna.jpg"
            alt="Munirathna"
            className="w-16 h-16 rounded-full object-cover shadow-lg"
          />
          <div className="flex justify-end">
            <img
              src="/bjp.webp"
              alt="BJP logo"
              className="w-[17.375rem] h-auto object-contain shadow-none -mt-5"
            />
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
