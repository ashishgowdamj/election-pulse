import { useState, useEffect, useMemo } from 'react';
import { Users, User, UserCircle2, HelpCircle, Home, Copy, Building2, MapPin, Calendar } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import SideStatCard from '@/components/dashboard/SideStatCard';
import CasteWiseChart from '@/components/dashboard/CasteWiseChart';
import ElectionResultCard from '@/components/dashboard/ElectionResultCard';
import GenderBoothChart from '@/components/dashboard/GenderBoothChart';
import VoterTable from '@/components/dashboard/VoterTable';
import FilterBar, { FilterValues } from '@/components/dashboard/FilterBar';
import { voterStats, casteData, genderBoothData, electionResult, sampleVoters } from '@/data/mockElectionData';
import { toast } from '@/hooks/use-toast';

const initialFilters: FilterValues = {
  search: '',
  ward: 'all',
  booth: 'all',
  gender: 'all',
  caste: 'all',
  ageGroup: 'all',
  motherTongue: 'all',
  voterType: 'all',
  pollingStation: 'all',
  society: 'all',
  hasRationCard: 'all',
  hasComplaint: 'all',
};

const Index = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [stats, setStats] = useState(voterStats);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filter voters based on active filters
  const filteredVoters = useMemo(() => {
    return sampleVoters.filter((voter) => {
      // Search filter
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

      // Ward filter
      if (filters.ward && filters.ward !== 'all') {
        if (voter.wardNo !== filters.ward) return false;
      }

      // Gender filter
      if (filters.gender && filters.gender !== 'all') {
        if (voter.gender.toLowerCase() !== filters.gender) return false;
      }

      // Caste filter
      if (filters.caste && filters.caste !== 'all') {
        if (voter.caste?.toLowerCase() !== filters.caste) return false;
      }

      // Age group filter
      if (filters.ageGroup && filters.ageGroup !== 'all') {
        const age = voter.age;
        switch (filters.ageGroup) {
          case '18-25':
            if (age < 18 || age > 25) return false;
            break;
          case '26-35':
            if (age < 26 || age > 35) return false;
            break;
          case '36-45':
            if (age < 36 || age > 45) return false;
            break;
          case '46-55':
            if (age < 46 || age > 55) return false;
            break;
          case '56-65':
            if (age < 56 || age > 65) return false;
            break;
          case '65+':
            if (age < 65) return false;
            break;
        }
      }

      // Mother tongue filter
      if (filters.motherTongue && filters.motherTongue !== 'all') {
        if (voter.motherTongue?.toLowerCase() !== filters.motherTongue) return false;
      }

      // Ration card filter
      if (filters.hasRationCard && filters.hasRationCard !== 'all') {
        const hasCard = !!voter.rationCardNo;
        if (filters.hasRationCard === 'yes' && !hasCard) return false;
        if (filters.hasRationCard === 'no' && hasCard) return false;
      }

      // Complaint filter
      if (filters.hasComplaint && filters.hasComplaint !== 'all') {
        const hasComplaint = !!voter.complaint;
        if (filters.hasComplaint === 'yes' && !hasComplaint) return false;
        if (filters.hasComplaint === 'no' && hasComplaint) return false;
      }

      return true;
    });
  }, [filters]);

  // Calculate filtered stats
  const filteredStats = useMemo(() => {
    const total = filteredVoters.length;
    const male = filteredVoters.filter(v => v.gender === 'Male').length;
    const female = filteredVoters.filter(v => v.gender === 'Female').length;
    const other = filteredVoters.filter(v => v.gender === 'Other').length;
    
    // Scale stats based on filter ratio (for demo purposes)
    const ratio = total / sampleVoters.length;
    
    return {
      ...stats,
      totalVoters: Math.round(stats.totalVoters * ratio),
      maleVoters: Math.round(stats.maleVoters * ratio),
      femaleVoters: Math.round(stats.femaleVoters * ratio),
      otherVoters: Math.round(stats.otherVoters * ratio),
    };
  }, [filteredVoters, stats]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    toast({
      title: 'Filters Applied',
      description: 'Dashboard data has been filtered.',
    });
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    toast({
      title: 'Filters Cleared',
      description: 'All filters have been reset.',
    });
  };

  const handleRefresh = (type: string) => {
    toast({
      title: 'Refreshing Data',
      description: `Updating ${type} statistics...`,
    });
    setTimeout(() => {
      setStats(prev => ({
        ...prev,
        [type]: prev[type as keyof typeof prev] + Math.floor(Math.random() * 10 - 5),
      }));
      toast({
        title: 'Data Updated',
        description: `${type} statistics refreshed successfully.`,
      });
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeItem={activeMenuItem} onItemClick={setActiveMenuItem} />
      
      <main className="flex-1 p-6 overflow-auto">
        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            value={filteredStats.totalVoters}
            label="Total Voter"
            variant="red"
            icon={<Users className="w-8 h-8" />}
            onRefresh={() => handleRefresh('totalVoters')}
          />
          <StatCard
            value={filteredStats.maleVoters}
            label="Male Voter"
            variant="blue"
            icon={<User className="w-8 h-8" />}
            onRefresh={() => handleRefresh('maleVoters')}
          />
          <StatCard
            value={filteredStats.femaleVoters}
            label="Female Voter"
            variant="green"
            icon={<UserCircle2 className="w-8 h-8" />}
            onRefresh={() => handleRefresh('femaleVoters')}
          />
          <StatCard
            value={filteredStats.otherVoters}
            label="Other Voter"
            variant="orange"
            icon={<HelpCircle className="w-8 h-8" />}
            onRefresh={() => handleRefresh('otherVoters')}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CasteWiseChart data={casteData} onRefresh={() => handleRefresh('caste')} />
              <ElectionResultCard result={electionResult} />
            </div>
            <GenderBoothChart data={genderBoothData} />
          </div>

          {/* Right Column - Side Stats */}
          <div className="space-y-4">
            <SideStatCard
              value={stats.youthVoters}
              label="Youth Voter"
              icon={<Users className="w-5 h-5" />}
              variant="orange"
            />
            <SideStatCard
              value={stats.duplicateVoters}
              label="Duplicate Voter"
              icon={<Copy className="w-5 h-5" />}
              variant="red"
            />
            <SideStatCard
              value={stats.voterCountOnHouse}
              label="Voter Count on House"
              icon={<Home className="w-5 h-5" />}
              variant="teal"
            />
            <SideStatCard
              value={stats.totalBooth}
              label="Total Booth"
              icon={<Building2 className="w-5 h-5" />}
              variant="yellow"
            />
            <SideStatCard
              value={stats.totalEvent}
              label="Total Event"
              icon={<Calendar className="w-5 h-5" />}
              variant="green"
            />
          </div>
        </div>

        {/* Voter Table */}
        <VoterTable voters={filteredVoters} />

        {/* Results Summary */}
        {filteredVoters.length !== sampleVoters.length && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {filteredVoters.length} of {sampleVoters.length} voters based on applied filters
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
