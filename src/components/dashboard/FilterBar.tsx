import { useState } from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export interface FilterValues {
  search: string;
  ward: string;
  booth: string;
  gender: string;
  caste: string;
  ageGroup: string;
  motherTongue: string;
  voterType: string;
  pollingStation: string;
  society: string;
  hasRationCard: string;
  hasComplaint: string;
}

interface FilterBarProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onClearFilters: () => void;
}

const wardOptions = [
  { value: 'all', label: 'All Wards' },
  { value: '1', label: 'Ward 1 - Central' },
  { value: '2', label: 'Ward 2 - North' },
  { value: '3', label: 'Ward 3 - East' },
  { value: '4', label: 'Ward 4 - South' },
  { value: '5', label: 'Ward 5 - West' },
  { value: '6', label: 'Ward 6 - Industrial' },
  { value: '7', label: 'Ward 7 - Market' },
  { value: '8', label: 'Ward 8 - Residential' },
  { value: '9', label: 'Ward 9 - Hospital' },
  { value: '10', label: 'Ward 10 - College' },
];

const boothOptions = [
  { value: 'all', label: 'All Booths' },
  ...Array.from({ length: 19 }, (_, i) => ({
    value: String(80 + i),
    label: `Booth ${80 + i}`,
  })),
];

const genderOptions = [
  { value: 'all', label: 'All Genders' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const casteOptions = [
  { value: 'all', label: 'All Castes' },
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'others', label: 'Others' },
];

const ageGroupOptions = [
  { value: 'all', label: 'All Ages' },
  { value: '18-25', label: '18-25 (Youth)' },
  { value: '26-35', label: '26-35' },
  { value: '36-45', label: '36-45' },
  { value: '46-55', label: '46-55' },
  { value: '56-65', label: '56-65' },
  { value: '65+', label: '65+ (Senior)' },
];

const motherTongueOptions = [
  { value: 'all', label: 'All Languages' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'english', label: 'English' },
  { value: 'urdu', label: 'Urdu' },
  { value: 'punjabi', label: 'Punjabi' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'other', label: 'Other' },
];

const voterTypeOptions = [
  { value: 'all', label: 'All Voters' },
  { value: 'new', label: 'New Voters' },
  { value: 'existing', label: 'Existing Voters' },
  { value: 'transferred', label: 'Transferred' },
  { value: 'deleted', label: 'Deleted' },
];

const pollingStationOptions = [
  { value: 'all', label: 'All Stations' },
  { value: 'ps1', label: 'Government School' },
  { value: 'ps2', label: 'Community Hall' },
  { value: 'ps3', label: 'Municipal Office' },
  { value: 'ps4', label: 'College Building' },
  { value: 'ps5', label: 'Temple Complex' },
];

const societyOptions = [
  { value: 'all', label: 'All Societies' },
  { value: 'green-valley', label: 'Green Valley Society' },
  { value: 'unity-apartments', label: 'Unity Apartments' },
  { value: 'sunrise-colony', label: 'Sunrise Colony' },
  { value: 'metro-heights', label: 'Metro Heights' },
  { value: 'individual', label: 'Individual House' },
];

const rationCardOptions = [
  { value: 'all', label: 'All' },
  { value: 'yes', label: 'Has Ration Card' },
  { value: 'no', label: 'No Ration Card' },
];

const complaintOptions = [
  { value: 'all', label: 'All' },
  { value: 'yes', label: 'Has Complaint' },
  { value: 'no', label: 'No Complaint' },
];

const FilterBar = ({ filters, onFilterChange, onClearFilters }: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof FilterValues, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && value !== 'all' && value !== ''
  ).length;

  const getActiveFilters = () => {
    const active: { key: string; label: string; value: string }[] = [];
    if (filters.search) active.push({ key: 'search', label: 'Search', value: filters.search });
    if (filters.ward && filters.ward !== 'all') active.push({ key: 'ward', label: 'Ward', value: filters.ward });
    if (filters.booth && filters.booth !== 'all') active.push({ key: 'booth', label: 'Booth', value: filters.booth });
    if (filters.gender && filters.gender !== 'all') active.push({ key: 'gender', label: 'Gender', value: filters.gender });
    if (filters.caste && filters.caste !== 'all') active.push({ key: 'caste', label: 'Caste', value: filters.caste });
    if (filters.ageGroup && filters.ageGroup !== 'all') active.push({ key: 'ageGroup', label: 'Age', value: filters.ageGroup });
    if (filters.motherTongue && filters.motherTongue !== 'all') active.push({ key: 'motherTongue', label: 'Language', value: filters.motherTongue });
    if (filters.voterType && filters.voterType !== 'all') active.push({ key: 'voterType', label: 'Type', value: filters.voterType });
    if (filters.pollingStation && filters.pollingStation !== 'all') active.push({ key: 'pollingStation', label: 'Station', value: filters.pollingStation });
    if (filters.society && filters.society !== 'all') active.push({ key: 'society', label: 'Society', value: filters.society });
    if (filters.hasRationCard && filters.hasRationCard !== 'all') active.push({ key: 'hasRationCard', label: 'Ration Card', value: filters.hasRationCard });
    if (filters.hasComplaint && filters.hasComplaint !== 'all') active.push({ key: 'hasComplaint', label: 'Complaint', value: filters.hasComplaint });
    return active;
  };

  const removeFilter = (key: string) => {
    if (key === 'search') {
      handleChange('search', '');
    } else {
      handleChange(key as keyof FilterValues, 'all');
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md p-4 mb-6">
      {/* Primary Filter Row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by Name, Voter ID, Phone, Address..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="pl-10 bg-background"
          />
        </div>

        {/* Ward Filter */}
        <Select value={filters.ward} onValueChange={(v) => handleChange('ward', v)}>
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="Select Ward" />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border z-50">
            {wardOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Booth Filter */}
        <Select value={filters.booth} onValueChange={(v) => handleChange('booth', v)}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Select Booth" />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border z-50 max-h-[300px]">
            {boothOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gender Filter */}
        <Select value={filters.gender} onValueChange={(v) => handleChange('gender', v)}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border z-50">
            {genderOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Caste Filter */}
        <Select value={filters.caste} onValueChange={(v) => handleChange('caste', v)}>
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Caste" />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border z-50">
            {casteOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* More Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          More Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Clear All Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <RotateCcw className="w-4 h-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-border pt-3 mt-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Age Group Filter */}
            <Select value={filters.ageGroup} onValueChange={(v) => handleChange('ageGroup', v)}>
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {ageGroupOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mother Tongue Filter */}
            <Select value={filters.motherTongue} onValueChange={(v) => handleChange('motherTongue', v)}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Mother Tongue" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {motherTongueOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Voter Type Filter */}
            <Select value={filters.voterType} onValueChange={(v) => handleChange('voterType', v)}>
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="Voter Type" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {voterTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Polling Station Filter */}
            <Select value={filters.pollingStation} onValueChange={(v) => handleChange('pollingStation', v)}>
              <SelectTrigger className="w-[170px] bg-background">
                <SelectValue placeholder="Polling Station" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {pollingStationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Society Filter */}
            <Select value={filters.society} onValueChange={(v) => handleChange('society', v)}>
              <SelectTrigger className="w-[170px] bg-background">
                <SelectValue placeholder="Society" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {societyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Ration Card Filter */}
            <Select value={filters.hasRationCard} onValueChange={(v) => handleChange('hasRationCard', v)}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Ration Card" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {rationCardOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Complaint Filter */}
            <Select value={filters.hasComplaint} onValueChange={(v) => handleChange('hasComplaint', v)}>
              <SelectTrigger className="w-[150px] bg-background">
                <SelectValue placeholder="Complaint" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {complaintOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Tags */}
      {getActiveFilters().length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground">Active Filters:</span>
          {getActiveFilters().map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="gap-1 pr-1 bg-primary/10 text-primary hover:bg-primary/20"
            >
              <span className="font-medium">{filter.label}:</span> {filter.value}
              <button
                onClick={() => removeFilter(filter.key)}
                className="ml-1 p-0.5 rounded-full hover:bg-primary/20"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
