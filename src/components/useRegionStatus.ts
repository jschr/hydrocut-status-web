import { useMemo } from 'react';
import useSWR from 'swr';
import { getRegionStatus, RegionStatus } from '../api';

export default function useRegionStatus(): [
  RegionStatus | null,
  number | null,
] {
  const { data = null, error } = useSWR(
    'da89b866-ef8d-4853-aab3-7c0f3a1c2fbd',
    getRegionStatus,
    {
      refreshInterval: 60 * 1000,
    },
  );

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
