import { useMemo } from 'react';
import useSWR from 'swr';
import { getRegionStatus, RegionStatus } from '../api';

export default function useRegionStatus(
  regionId: string,
): [RegionStatus | null, number | null] {
  const { data = null, error } = useSWR(regionId, getRegionStatus, {
    refreshInterval: 60 * 1000,
  });

  if (error) {
    console.error('Error fetching region status', error);
  }

  const daysSinceLastChange = useMemo(() => {
    if (!data) return null;
    const now = new Date();
    const updatedAt = new Date(data.updatedAt);
    return Math.round((+now - +updatedAt) / 1000 / 60 / 60 / 24);
  }, [data]);

  return [data, daysSinceLastChange];
}
