import useSWR from 'swr';
import { getRegionHistory, RegionHistory } from '../api';

export default function useRegionHistory(
  regionId: string,
): [RegionHistory[] | null, number | null] {
  const { data = null, error } = useSWR(
    `${regionId}/history`,
    () => getRegionHistory(regionId),
    {
      refreshInterval: 60 * 1000,
    },
  );

  if (error) {
    console.error('Error fetching region history', error);
  }

  return [data, null];
}
