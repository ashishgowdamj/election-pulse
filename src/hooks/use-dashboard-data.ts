import { useQuery } from '@tanstack/react-query';
import { FilterValues } from '@/components/dashboard/FilterBar';
import { apiFetch } from '@/lib/api';
import { CasteData, GenderBoothData, Voter, VoterStats } from '@/types/election';

interface VoterPayload {
  total: number;
  data: Voter[];
}

const buildQuery = (filters: FilterValues, extra?: Record<string, string | number>) => {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim().toLowerCase());
  }

  (Object.keys(filters) as (keyof FilterValues)[])
    .filter((key) => key !== 'search')
    .forEach((key) => {
      const values = filters[key];
      if (Array.isArray(values) && values.length > 0) {
        params.set(key, values.join(','));
      }
    });

  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      params.set(key, String(value));
    });
  }

  const query = params.toString();
  return query ? `?${query}` : '';
};

export const useDashboardStats = (filters: FilterValues) =>
  useQuery({
    queryKey: ['dashboard-stats', filters],
    queryFn: () => apiFetch<VoterStats>(`/api/dashboard/stats${buildQuery(filters)}`),
  });

export const useCasteBreakdown = (filters: FilterValues) =>
  useQuery({
    queryKey: ['caste-breakdown', filters],
    queryFn: () => apiFetch<CasteData[]>(`/api/dashboard/caste${buildQuery(filters)}`),
  });

export const useGenderAreaBreakdown = (filters: FilterValues) =>
  useQuery({
    queryKey: ['gender-area', filters],
    queryFn: () => apiFetch<GenderBoothData[]>(`/api/dashboard/gender-areas${buildQuery(filters)}`),
  });

export const useVoters = (filters: FilterValues, limit = 500) =>
  useQuery({
    queryKey: ['voters', filters, limit],
    queryFn: () => apiFetch<VoterPayload>(`/api/dashboard/voters${buildQuery(filters, { limit })}`),
    staleTime: 1000 * 30,
  });
