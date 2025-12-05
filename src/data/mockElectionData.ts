import { VoterStats, CasteData, GenderBoothData, ElectionResult, Voter, PieSlice, BarStat } from '@/types/election';

export const voterStats: VoterStats = {
  totalVoters: 96716,
  maleVoters: 49245,
  femaleVoters: 47471,
  otherVoters: 0,
  youthVoters: 17760,
  duplicateVoters: 8680,
  voterCountOnHouse: 24000,
  totalBooth: 98,
  totalEvent: 20,
};

export const casteData: CasteData[] = [
  { name: 'General', value: 35, color: 'hsl(175, 70%, 45%)' },
  { name: 'OBC', value: 28, color: 'hsl(200, 80%, 50%)' },
  { name: 'SC', value: 18, color: 'hsl(145, 65%, 45%)' },
  { name: 'ST', value: 12, color: 'hsl(35, 90%, 50%)' },
  { name: 'Others', value: 7, color: 'hsl(0, 75%, 50%)' },
];

export const genderBoothData: GenderBoothData[] = [
  { booth: '80', male: 520, female: 490 },
  { booth: '81', male: 480, female: 510 },
  { booth: '82', male: 550, female: 520 },
  { booth: '83', male: 490, female: 480 },
  { booth: '84', male: 530, female: 540 },
  { booth: '85', male: 510, female: 500 },
  { booth: '86', male: 540, female: 530 },
  { booth: '87', male: 500, female: 490 },
  { booth: '88', male: 560, female: 550 },
  { booth: '89', male: 520, female: 510 },
  { booth: '90', male: 490, female: 520 },
  { booth: '91', male: 530, female: 500 },
  { booth: '92', male: 510, female: 490 },
  { booth: '93', male: 540, female: 530 },
  { booth: '94', male: 500, female: 510 },
  { booth: '95', male: 520, female: 540 },
  { booth: '96', male: 480, female: 490 },
  { booth: '97', male: 550, female: 520 },
  { booth: '98', male: 530, female: 510 },
];

export const electionResult: ElectionResult = {
  year: 2012,
  winner: 'Surendra Singh Negi',
  party: 'INC',
  totalVotes: 31797,
  winMargin: 7446,
  marginPercentage: 7.44,
  maleVoter: 29618,
  femaleVoter: 31856,
  otherVoter: 0,
  pollingPercentage: 71.44,
};

export const sampleVoters: Voter[] = [
  {
    slNo: 1,
    cardNo: 'VC001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    newAddress: '123 Main Street, Ward 5',
    oldAddress: '456 Old Lane',
    voterId: 'VID123456',
    parNo: 'PAR001',
    wardName: 'Central',
    wardNo: '5',
    rationCardNo: 'RC789012',
    societyName: 'Green Valley Society',
    societyAddress: 'Block A, Sector 7',
    caste: 'General',
    motherTongue: 'Hindi',
    phoneNo: '9876543210',
    landmark: 'Near Temple',
    nextHouseMobNo: '9876543211',
  },
  {
    slNo: 2,
    cardNo: 'VC002',
    name: 'Sunita Devi',
    age: 38,
    gender: 'Female',
    newAddress: '789 Park Road, Ward 3',
    voterId: 'VID234567',
    parNo: 'PAR002',
    wardName: 'East',
    wardNo: '3',
    caste: 'OBC',
    motherTongue: 'Hindi',
    phoneNo: '9876543212',
  },
  {
    slNo: 3,
    cardNo: 'VC003',
    name: 'Mohammed Ali',
    age: 52,
    gender: 'Male',
    newAddress: '456 Market Street, Ward 7',
    oldAddress: '123 Temple Road',
    voterId: 'VID345678',
    parNo: 'PAR003',
    wardName: 'West',
    wardNo: '7',
    rationCardNo: 'RC456789',
    caste: 'General',
    motherTongue: 'Urdu',
    phoneNo: '9876543213',
    societyName: 'Unity Apartments',
    societyAddress: 'Block C, Phase 2',
  },
  {
    slNo: 4,
    cardNo: 'VC004',
    name: 'Priya Singh',
    age: 29,
    gender: 'Female',
    newAddress: '321 College Road, Ward 2',
    voterId: 'VID456789',
    parNo: 'PAR004',
    wardName: 'North',
    wardNo: '2',
    caste: 'SC',
    motherTongue: 'Hindi',
    phoneNo: '9876543214',
  },
  {
    slNo: 5,
    cardNo: 'VC005',
    name: 'Arun Sharma',
    age: 61,
    gender: 'Male',
    newAddress: '567 Hospital Lane, Ward 9',
    oldAddress: '890 Industrial Area',
    voterId: 'VID567890',
    parNo: 'PAR005',
    wardName: 'South',
    wardNo: '9',
    rationCardNo: 'RC012345',
    caste: 'General',
    motherTongue: 'Hindi',
    phoneNo: '9876543215',
    complaint: 'Address update pending',
  },
];

export const householdInsights: HouseholdInsight[] = [
  {
    id: 'house-1',
    society: 'Green Valley Society',
    address: 'Block A, Ward 5',
    households: 420,
    voterCount: 1320,
    coordinator: 'Mahesh Tiwari',
  },
  {
    id: 'house-2',
    society: 'Unity Apartments',
    address: 'Sector 7, Ward 7',
    households: 310,
    voterCount: 980,
    coordinator: 'Farha Naaz',
  },
  {
    id: 'house-3',
    society: 'Park View Residency',
    address: 'Ring Road, Ward 3',
    households: 265,
    voterCount: 845,
    coordinator: 'Gaurav Joshi',
  },
  {
    id: 'house-4',
    society: 'Riverfront Heights',
    address: 'Ward 9 near Hospital Lane',
    households: 380,
    voterCount: 1115,
    coordinator: 'Sanjana Raut',
  },
];

export const pollingStations: PollingStation[] = [
  {
    id: 'ps-80',
    name: 'Govt. Inter College',
    address: 'Ward 5, Main Road',
    sector: 'Central',
    presidingOfficer: 'Dinesh Nautiyal',
    contact: '0135-1234567',
    totalVoters: 1420,
  },
  {
    id: 'ps-81',
    name: 'Public School Hall',
    address: 'Ward 3, Park Road',
    sector: 'East',
    presidingOfficer: 'Vinita Mehra',
    contact: '0135-1234599',
    totalVoters: 1588,
    isCritical: true,
  },
  {
    id: 'ps-82',
    name: 'Community Center',
    address: 'Ward 7, Unity Nagar',
    sector: 'West',
    presidingOfficer: 'Parag Negi',
    contact: '0135-1234511',
    totalVoters: 1350,
  },
  {
    id: 'ps-83',
    name: 'Maharishi Vidya Mandir',
    address: 'Ward 9, Riverfront',
    sector: 'South',
    presidingOfficer: 'Kusum Thapa',
    contact: '0135-1234556',
    totalVoters: 1624,
  },
];

export const campaignEvents: CampaignEvent[] = [
  {
    id: 'event-1',
    title: 'Booth Management Workshop',
    date: '2024-07-28 10:00',
    location: 'District Office',
    status: 'Scheduled',
    coordinator: 'Anil Gupta',
    description: 'Training session for booth level volunteers.',
  },
  {
    id: 'event-2',
    title: 'Women Outreach Drive',
    date: '2024-07-30 15:00',
    location: 'Unity Apartments',
    status: 'Scheduled',
    coordinator: 'Shalini Rawal',
    description: 'Door-to-door campaign targeting female voters.',
  },
  {
    id: 'event-3',
    title: 'Youth Townhall',
    date: '2024-07-20 17:00',
    location: 'City Auditorium',
    status: 'Completed',
    coordinator: 'Manish Kumar',
    description: 'Interactive discussion with first-time voters.',
  },
];


export const houseOwnership: PieSlice[] = [
  { label: 'Lease', value: 33, color: '#facc15' },
  { label: 'Own', value: 36, color: '#3b82f6' },
  { label: 'Rent', value: 32, color: '#06b6d4' },
];

export const societyDistribution: PieSlice[] = [
  { label: 'Balaji Layout', value: 16, color: '#2563eb' },
  { label: 'BEML 3rd Stage', value: 14, color: '#93c5fd' },
  { label: 'Channasandra', value: 18, color: '#f97316' },
  { label: 'Green Meadows', value: 13, color: '#fed7aa' },
  { label: 'Park View', value: 13, color: '#15803d' },
  { label: 'Lalbagh Ext.', value: 15, color: '#86efac' },
  { label: 'Riverfront', value: 11, color: '#ef4444' },
];

export const wardDistribution: PieSlice[] = [
  { label: 'Ward 159', value: 32, color: '#06b6d4' },
  { label: 'Ward 160', value: 32, color: '#ef4444' },
  { label: 'Ward 161', value: 36, color: '#f59e0b' },
];

export const professionStats: BarStat[] = [
  { label: 'Driver', value: 26, color: '#22c55e' },
  { label: 'Electrician', value: 34, color: '#22c55e' },
  { label: 'Engineer', value: 20, color: '#22c55e' },
  { label: 'Housewife', value: 25, color: '#22c55e' },
  { label: 'Labour', value: 22, color: '#22c55e' },
  { label: 'Shopkeeper', value: 23, color: '#22c55e' },
  { label: 'Student', value: 27, color: '#22c55e' },
  { label: 'Tailor', value: 24, color: '#22c55e' },
];

export const educationStats: BarStat[] = [
  { label: '10th', value: 26, color: '#3b82f6' },
  { label: 'Degree', value: 40, color: '#3b82f6' },
  { label: 'Diploma', value: 55, color: '#3b82f6' },
  { label: 'LLB', value: 43, color: '#3b82f6' },
  { label: 'PUC', value: 36, color: '#3b82f6' },
];

export const motherTongueDistribution: PieSlice[] = [
  { label: 'Hindi', value: 24, color: '#2563eb' },
  { label: 'Kannada', value: 30, color: '#93c5fd' },
  { label: 'Tamil', value: 24, color: '#f97316' },
  { label: 'Telugu', value: 22, color: '#fdba74' },
];

export const genderDistribution: PieSlice[] = [
  { label: 'Female', value: 52, color: '#3b82f6' },
  { label: 'Male', value: 48, color: '#06b6d4' },
];

export const ageDistribution: BarStat[] = [
  { label: '1-5', value: 4, color: '#a855f7' },
  { label: '11-15', value: 22, color: '#a855f7' },
  { label: '21-25', value: 18, color: '#a855f7' },
  { label: '31-35', value: 20, color: '#a855f7' },
  { label: '41-45', value: 19, color: '#a855f7' },
  { label: '51-55', value: 17, color: '#a855f7' },
  { label: '61-65', value: 15, color: '#a855f7' },
  { label: '71-75', value: 21, color: '#a855f7' },
  { label: '81-85', value: 26, color: '#a855f7' },
];
