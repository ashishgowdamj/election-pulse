import { useState } from 'react';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MultiSelect from './MultiSelect';
import { Badge } from '@/components/ui/badge';

export interface FilterValues {
  search: string;
  ward: string[];
  booth: string[];
  gender: string[];
  caste: string[];
  ageGroup: string[];
  motherTongue: string[];
  voterType: string[];
  pollingStation: string[];
  society: string[];
  hasRationCard: string[];
  hasComplaint: string[];
}

export type FilterOption = { value: string; label: string };

export const defaultFilterOptions: Record<string, FilterOption[]> = {
  ward: [
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
  ],
  booth: [
    { value: 'all', label: 'All Booths' },
    ...Array.from({ length: 19 }, (_, i) => ({
      value: String(80 + i),
      label: `Booth ${80 + i}`,
    })),
  ],
  gender: [
    { value: 'all', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ],
  caste: [
    { value: 'all', label: 'All Castes' },
    { value: 'general', label: 'General' },
    { value: 'obc', label: 'OBC' },
    { value: 'sc', label: 'SC' },
    { value: 'st', label: 'ST' },
    { value: 'others', label: 'Others' },
  ],
  ageGroup: [
    { value: 'all', label: 'All Ages' },
    { value: '18-25', label: '18-25 (Youth)' },
    { value: '26-35', label: '26-35' },
    { value: '36-45', label: '36-45' },
    { value: '46-55', label: '46-55' },
    { value: '56-65', label: '56-65' },
    { value: '65+', label: '65+ (Senior)' },
  ],
  motherTongue: [
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
  ],
  voterType: [
    { value: 'all', label: 'All Voters' },
    { value: 'new', label: 'New Voters' },
    { value: 'existing', label: 'Existing Voters' },
    { value: 'transferred', label: 'Transferred' },
    { value: 'deleted', label: 'Deleted' },
  ],
  pollingStation: [
    { value: 'all', label: 'All Stations' },
    { value: 'ps1', label: 'Government School' },
    { value: 'ps2', label: 'Community Hall' },
    { value: 'ps3', label: 'Municipal Office' },
    { value: 'ps4', label: 'College Building' },
    { value: 'ps5', label: 'Temple Complex' },
  ],
  society: [
    { value: 'all', label: 'All Societies' },
    { value: 'green-valley', label: 'Green Valley Society' },
    { value: 'unity-apartments', label: 'Unity Apartments' },
    { value: 'sunrise-colony', label: 'Sunrise Colony' },
    { value: 'metro-heights', label: 'Metro Heights' },
    { value: 'individual', label: 'Individual House' },
  ],
  hasRationCard: [
    { value: 'all', label: 'All' },
    { value: 'yes', label: 'Has Ration Card' },
    { value: 'no', label: 'No Ration Card' },
  ],
  hasComplaint: [
    { value: 'all', label: 'All' },
    { value: 'yes', label: 'Has Complaint' },
    { value: 'no', label: 'No Complaint' },
  ],
};

interface FilterBarProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onClearFilters: () => void;
  optionOverrides?: Partial<typeof defaultFilterOptions>;
}

const FilterBar = ({ filters, onFilterChange, onClearFilters, optionOverrides }: FilterBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const wardOptions = optionOverrides?.ward ?? defaultFilterOptions.ward;
  const boothOptions = optionOverrides?.booth ?? defaultFilterOptions.booth;
  const genderOptions = optionOverrides?.gender ?? defaultFilterOptions.gender;
  const casteOptions = optionOverrides?.caste ?? defaultFilterOptions.caste;
  const ageGroupOptions = optionOverrides?.ageGroup ?? defaultFilterOptions.ageGroup;
  const motherTongueOptions = optionOverrides?.motherTongue ?? defaultFilterOptions.motherTongue;
  const voterTypeOptions = optionOverrides?.voterType ?? defaultFilterOptions.voterType;
  const pollingStationOptions =
    optionOverrides?.pollingStation ?? defaultFilterOptions.pollingStation;
  const societyOptions = optionOverrides?.society ?? defaultFilterOptions.society;
  const rationCardOptions = optionOverrides?.hasRationCard ?? defaultFilterOptions.hasRationCard;
  const complaintOptions = optionOverrides?.hasComplaint ?? defaultFilterOptions.hasComplaint;

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleMultiChange = (key: keyof FilterValues, values: string[]) => {
    onFilterChange({ ...filters, [key]: values });
  };

  const multiKeys: Array<Exclude<keyof FilterValues, 'search'>> = [
    'ward',
    'booth',
    'gender',
    'caste',
    'ageGroup',
    'motherTongue',
    'voterType',
    'pollingStation',
    'society',
    'hasRationCard',
    'hasComplaint',
  ];

  const optionLookup: Record<keyof FilterValues, Map<string, string>> = {
    search: new Map(),
    ward: new Map(wardOptions.map((option) => [option.value, option.label])),
    booth: new Map(boothOptions.map((option) => [option.value, option.label])),
    gender: new Map(genderOptions.map((option) => [option.value, option.label])),
    caste: new Map(casteOptions.map((option) => [option.value, option.label])),
    ageGroup: new Map(ageGroupOptions.map((option) => [option.value, option.label])),
    motherTongue: new Map(motherTongueOptions.map((option) => [option.value, option.label])),
    voterType: new Map(voterTypeOptions.map((option) => [option.value, option.label])),
    pollingStation: new Map(pollingStationOptions.map((option) => [option.value, option.label])),
    society: new Map(societyOptions.map((option) => [option.value, option.label])),
    hasRationCard: new Map(rationCardOptions.map((option) => [option.value, option.label])),
    hasComplaint: new Map(complaintOptions.map((option) => [option.value, option.label])),
  };

  const formatSelectedValues = (key: keyof FilterValues, values: string[]) => {
    const lookup = optionLookup[key];
    return values.map((val) => lookup.get(val) ?? val).join(', ');
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    multiKeys.filter((key) => filters[key].length > 0).length;

  const getActiveFilters = () => {
    const active: { key: string; label: string; value: string }[] = [];
    if (filters.search) active.push({ key: 'search', label: 'Search', value: filters.search });
    multiKeys.forEach((key) => {
      if (filters[key].length > 0) {
        const label =
          {
            ward: 'Ward',
            booth: 'Booth',
            gender: 'Gender',
            caste: 'Caste',
            ageGroup: 'Age',
            motherTongue: 'Language',
            voterType: 'Type',
            pollingStation: 'Station',
            society: 'Society',
            hasRationCard: 'Ration Card',
            hasComplaint: 'Complaint',
          }[key] || key;
        active.push({
          key,
          label,
          value: formatSelectedValues(key, filters[key]),
        });
      }
    });
    return active;
  };

  const removeFilter = (key: string) => {
    if (key === 'search') {
      handleSearchChange('');
    } else {
      handleMultiChange(key as keyof FilterValues, []);
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>

        <MultiSelect
          placeholder="Ward"
          value={filters.ward}
          options={wardOptions}
          onChange={(values) => handleMultiChange('ward', values)}
        />
        <MultiSelect
          placeholder="Booth"
          value={filters.booth}
          options={boothOptions}
          onChange={(values) => handleMultiChange('booth', values)}
        />
        <MultiSelect
          placeholder="Gender"
          value={filters.gender}
          options={genderOptions}
          onChange={(values) => handleMultiChange('gender', values)}
        />

        <MultiSelect
          placeholder="Caste"
          value={filters.caste}
          options={casteOptions}
          onChange={(values) => handleMultiChange('caste', values)}
        />

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
            <MultiSelect
              placeholder="Age Group"
              value={filters.ageGroup}
              options={ageGroupOptions}
              onChange={(values) => handleMultiChange('ageGroup', values)}
            />
            <MultiSelect
              placeholder="Mother Tongue"
              value={filters.motherTongue}
              options={motherTongueOptions}
              onChange={(values) => handleMultiChange('motherTongue', values)}
            />
            <MultiSelect
              placeholder="Voter Type"
              value={filters.voterType}
              options={voterTypeOptions}
              onChange={(values) => handleMultiChange('voterType', values)}
            />
            <MultiSelect
              placeholder="Polling Station"
              value={filters.pollingStation}
              options={pollingStationOptions}
              onChange={(values) => handleMultiChange('pollingStation', values)}
            />
            <MultiSelect
              placeholder="Society"
              value={filters.society}
              options={societyOptions}
              onChange={(values) => handleMultiChange('society', values)}
            />
            <MultiSelect
              placeholder="Ration Card"
              value={filters.hasRationCard}
              options={rationCardOptions}
              onChange={(values) => handleMultiChange('hasRationCard', values)}
            />
            <MultiSelect
              placeholder="Complaint"
              value={filters.hasComplaint}
              options={complaintOptions}
              onChange={(values) => handleMultiChange('hasComplaint', values)}
            />
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
