export interface VoterStats {
  totalVoters: number;
  maleVoters: number;
  femaleVoters: number;
  otherVoters: number;
  youthVoters: number;
  duplicateVoters: number;
  voterCountOnHouse: number;
  totalBooth: number;
  totalEvent: number;
}

export interface CasteData {
  name: string;
  value: number;
  color: string;
}

export interface GenderBoothData {
  booth: string;
  male: number;
  female: number;
}

export interface ElectionResult {
  year: number;
  winner: string;
  party: string;
  totalVotes: number;
  winMargin: number;
  marginPercentage: number;
  maleVoter: number;
  femaleVoter: number;
  otherVoter: number;
  pollingPercentage: number;
}

export interface Voter {
  slNo: number;
  cardNo: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  newAddress: string;
  oldAddress?: string;
  voterId: string;
  parNo: string;
  wardName: string;
  wardNo: string;
  rationCardNo?: string;
  societyName?: string;
  societyAddress?: string;
  caste?: string;
  motherTongue?: string;
  phoneNo?: string;
  complaint?: string;
  landmark?: string;
  nextHouseMobNo?: string;
  photo?: string;
  boothNo?: string;
  boothName?: string;
  pollingStation?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface HouseholdInsight {
  id: string;
  society: string;
  address: string;
  households: number;
  voterCount: number;
  coordinator: string;
}

export interface PollingStation {
  id: string;
  name: string;
  address: string;
  sector: string;
  presidingOfficer: string;
  contact: string;
  totalVoters: number;
  isCritical?: boolean;
}

export interface CampaignEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'Scheduled' | 'Completed';
  coordinator: string;
  description: string;
}


export interface PieSlice {
  label: string;
  value: number;
  color: string;
}

export interface BarStat {
  label: string;
  value: number;
  color?: string;
}
