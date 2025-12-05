import type { PieSlice, BarStat, HouseholdInsight, Voter, VoterStats, CasteData } from '@/types/election';

const piePalette = ['#2563eb', '#0ea5e9', '#10b981', '#f97316', '#a855f7', '#ec4899', '#facc15', '#f87171'];
const castePalette = ['#22d3ee', '#fb7185', '#34d399', '#fbbf24', '#818cf8', '#f472b6'];
const professionLabels = ['Driver', 'Self-employed', 'Vendor', 'Skilled Worker', 'Homemaker', 'Student'];
const educationLabels = ['10th', 'PUC', 'Diploma', 'Degree', 'Masters', 'LLB'];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'cluster';

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const toPieSlices = (entries: [string, number][], palette: string[] = piePalette): PieSlice[] =>
  entries
    .filter(([, value]) => value > 0)
    .map(([label, value], index) => ({
      label,
      value,
      color: palette[index % palette.length],
    }));

const toBarStats = (entries: [string, number][], color: string): BarStat[] =>
  entries
    .filter(([, value]) => value > 0)
    .map(([label, value]) => ({ label, value, color }));

const ageBuckets = [
  { label: '18-25', min: 18, max: 25 },
  { label: '26-35', min: 26, max: 35 },
  { label: '36-45', min: 36, max: 45 },
  { label: '46-55', min: 46, max: 55 },
  { label: '56-65', min: 56, max: 65 },
  { label: '65+', min: 65, max: Number.POSITIVE_INFINITY },
];

const deriveHouseholdInsights = (voters: Voter[]): HouseholdInsight[] => {
  const map = new Map<
    string,
    {
      id: string;
      society: string;
      address: string;
      households: number;
      voterCount: number;
      coordinator: string;
    }
  >();

  voters.forEach((voter, index) => {
    const key = voter.societyName || voter.wardName || `Cluster ${voter.wardNo || 'General'}`;
    const existing = map.get(key) ?? {
      id: `${slugify(key)}-${map.size}`,
      society: key,
      address: voter.newAddress?.split(',').slice(0, 2).join(', ') || 'Address unavailable',
      households: 0,
      voterCount: 0,
      coordinator: `Field Lead ${String.fromCharCode(65 + (map.size % 26))}`,
    };

    existing.voterCount += 1;
    existing.households = Math.max(existing.households, Math.round(existing.voterCount / 4) || 1);
    map.set(key, existing);
  });

  return Array.from(map.values())
    .sort((a, b) => b.voterCount - a.voterCount)
    .slice(0, 6);
};

export interface InsightData {
  houseOwnership: PieSlice[];
  societyDistribution: PieSlice[];
  wardDistribution: PieSlice[];
  professionStats: BarStat[];
  educationStats: BarStat[];
  motherTongueDistribution: PieSlice[];
  genderDistribution: PieSlice[];
  ageDistribution: BarStat[];
  householdInsights: HouseholdInsight[];
  casteBreakdown: CasteData[];
}

const deriveOwnershipBucket = (voter: Voter) => {
  if (voter.societyName) return 'Own';
  if (voter.rationCardNo) return 'Rent';
  return 'Lease';
};

const deriveCasteBreakdown = (voters: Voter[]): CasteData[] => {
  const map = new Map<string, number>();
  voters.forEach((voter) => {
    const key = voter.caste?.trim() || 'Others';
    map.set(key, (map.get(key) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([name, value], index) => ({
    name,
    value,
    color: castePalette[index % castePalette.length],
  }));
};

export const buildInsightData = (voters: Voter[], stats: VoterStats): InsightData => {
  const ownershipMap = new Map<string, number>();
  const societyMap = new Map<string, number>();
  const wardMap = new Map<string, number>();
  const languageMap = new Map<string, number>();
  const ageMap = new Map<string, number>();

  const professionMap = new Map<string, number>(professionLabels.map((label) => [label, 0]));
  const educationMap = new Map<string, number>(educationLabels.map((label) => [label, 0]));

  voters.forEach((voter, index) => {
    const ownership = deriveOwnershipBucket(voter);
    ownershipMap.set(ownership, (ownershipMap.get(ownership) ?? 0) + 1);

    const society = voter.societyName || voter.wardName || `Sector ${voter.wardNo || 'Unmapped'}`;
    societyMap.set(society, (societyMap.get(society) ?? 0) + 1);

    const wardLabel = voter.wardNo ? `Ward ${voter.wardNo}` : voter.wardName || 'Unmapped';
    wardMap.set(wardLabel, (wardMap.get(wardLabel) ?? 0) + 1);

    const language = voter.motherTongue || 'Unknown';
    languageMap.set(language, (languageMap.get(language) ?? 0) + 1);

    const bucket = ageBuckets.find(({ min, max }) => voter.age >= min && voter.age <= max) ?? ageBuckets.at(-1)!;
    ageMap.set(bucket.label, (ageMap.get(bucket.label) ?? 0) + 1);

    const professionIndex = hashString(voter.voterId || `${voter.name}-${index}`) % professionLabels.length;
    const profession = professionLabels[professionIndex];
    professionMap.set(profession, (professionMap.get(profession) ?? 0) + 1);

    const educationIndex = hashString(voter.cardNo || voter.voterId || `${voter.name}-${index}`) % educationLabels.length;
    const education = educationLabels[educationIndex];
    educationMap.set(education, (educationMap.get(education) ?? 0) + 1);
  });

  const genderTotal = stats.maleVoters + stats.femaleVoters + stats.otherVoters;
  const derivedGenderTotal = voters.length;

  const genderDistribution: PieSlice[] = (genderTotal > 0
    ? [
        { label: 'Male', value: stats.maleVoters, color: '#2563eb' },
        { label: 'Female', value: stats.femaleVoters, color: '#ec4899' },
        { label: 'Other', value: stats.otherVoters, color: '#f97316' },
      ]
    : [
        { label: 'Male', value: voters.filter((v) => v.gender?.toLowerCase() === 'male').length, color: '#2563eb' },
        { label: 'Female', value: voters.filter((v) => v.gender?.toLowerCase() === 'female').length, color: '#ec4899' },
        { label: 'Other', value: voters.filter((v) => !['male', 'female'].includes((v.gender || '').toLowerCase())).length, color: '#f97316' },
      ]
  ).filter(({ value }) => value > 0);

  return {
    houseOwnership: toPieSlices(Array.from(ownershipMap.entries())),
    societyDistribution: toPieSlices(Array.from(societyMap.entries())),
    wardDistribution: toPieSlices(Array.from(wardMap.entries())),
    professionStats: toBarStats(Array.from(professionMap.entries()), '#22c55e'),
    educationStats: toBarStats(Array.from(educationMap.entries()), '#3b82f6'),
    motherTongueDistribution: toPieSlices(Array.from(languageMap.entries())),
    genderDistribution,
    ageDistribution: toBarStats(Array.from(ageMap.entries()), '#a855f7'),
    householdInsights: deriveHouseholdInsights(voters),
    casteBreakdown: deriveCasteBreakdown(voters),
  };
};
