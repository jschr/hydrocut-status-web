export interface User {
  userId: string;
  username: string;
}

export interface RegionStatus {
  id: string;
  status: 'open' | 'closed';
  imageUrl: string;
  message: string;
  instagramPostId: string;
  instagramPermalink: string;
  updatedAt: string;
  user: User;
  airTemp: number | null;
  groundTemp: number | null;
}

const trailStatusApi = 'https://api.trailstatusapp.com';

export const getRegionStatus = async (id: string): Promise<RegionStatus> => {
  const url = `${trailStatusApi}/regions/status?id=${id}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};

export const subscribeToRegion = async (
  regionId: string,
  token: string,
): Promise<RegionStatus> => {
  const url = `${trailStatusApi}/fcm-subscribe`;
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ regionId, token }),
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};

export const unsubscribeToRegion = async (
  regionId: string,
  token: string,
): Promise<RegionStatus> => {
  const url = `${trailStatusApi}/fcm-unsubscribe`;
  const resp = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ regionId, token }),
  });

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};
