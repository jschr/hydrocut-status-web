import useSWR from 'swr';
import { getRegionStatus, RegionStatus } from '../api';

export default function useRegionStatus(
  regionId: string,
): [RegionStatus | null] {
  const { data = null, error } = useSWR(
    `${regionId}/status`,
    () => getRegionStatus(regionId),
    {
      refreshInterval: 60 * 1000,
    },
  );

  if (error) {
    console.error('Error fetching region status', error);
  }

  return [data];
}
