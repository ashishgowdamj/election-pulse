import { useState, useEffect } from 'react';
import { Users, User, UserCircle2, HelpCircle, Home, Copy, Building2, MapPin, Calendar } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import SideStatCard from '@/components/dashboard/SideStatCard';
import CasteWiseChart from '@/components/dashboard/CasteWiseChart';
import ElectionResultCard from '@/components/dashboard/ElectionResultCard';
import GenderBoothChart from '@/components/dashboard/GenderBoothChart';
import VoterTable from '@/components/dashboard/VoterTable';
import { voterStats, casteData, genderBoothData, electionResult, sampleVoters } from '@/data/mockElectionData';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [stats, setStats] = useState(voterStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = (type: string) => {
    toast({
      title: 'Refreshing Data',
      description: `Updating ${type} statistics...`,
    });
    // Simulate refresh with slight random variation
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
        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            value={stats.totalVoters}
            label="Total Voter"
            variant="red"
            icon={<Users className="w-8 h-8" />}
            onRefresh={() => handleRefresh('totalVoters')}
          />
          <StatCard
            value={stats.maleVoters}
            label="Male Voter"
            variant="blue"
            icon={<User className="w-8 h-8" />}
            onRefresh={() => handleRefresh('maleVoters')}
          />
          <StatCard
            value={stats.femaleVoters}
            label="Female Voter"
            variant="green"
            icon={<UserCircle2 className="w-8 h-8" />}
            onRefresh={() => handleRefresh('femaleVoters')}
          />
          <StatCard
            value={stats.otherVoters}
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
        <VoterTable voters={sampleVoters} />
      </main>
    </div>
  );
};

export default Index;
