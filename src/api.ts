export interface User {
  userId: string;
  username: string;
}

export type Status = 'open' | 'closed';

export interface RegionStatus {
  id: string;
  status: Status;
  imageUrl: string;
  message: string;
  instagramPostId: string;
  instagramPermalink: string;
  updatedAt: string;
  user: User;
  airTemp: number | null;
  groundTemp: number | null;
}

export interface RegionHistory {
  id: string;
  regionId: string;
  status: Status;
  imageUrl: string;
  message: string;
  instagramPostId: string;
  instagramPermalink: string;
  createdAt: string;
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

export const getRegionHistory = async (
  id: string,
): Promise<RegionHistory[]> => {
  const url = `${trailStatusApi}/regions/history?id=${id}`;
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
