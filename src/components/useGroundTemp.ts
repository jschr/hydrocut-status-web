import useSWR from 'swr';
import { useMemo } from 'react';
import { getDeviceChannel } from '../api';
import isStaleMetric from './isStaleMetric';

export default function useGroundTemp(): [number | null] {
  const { data, error } = useSWR('1191345', getDeviceChannel, {
    refreshInterval: 60 * 1000,
  });

  if (error) {
    console.error('Error fetching ground temp channel', error);
  }

  const groundTemp = useMemo(() => {
    if (!data) return null;
    const latest = data?.feeds[0];
    if (!latest) return null;
    if (isStaleMetric(latest.created_at)) return null;
    const temp = Math.round(parseFloat(latest.field2));
    if (isNaN(temp)) return null;
    return temp;
  }, [data]);

  return [groundTemp];
}
