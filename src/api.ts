const baseUrl = 'https://api.trailstatusapp.com';

export interface User {
  userId: string;
  username: string;
}

export interface TrailStatus {
  id: string;
  status: 'opened' | 'closed';
  imageUrl: string;
  message: string;
  instagramPostId: string;
  updatedAt: string;
  user: User;
}

export const getTrailStatus = async (trailId: string): Promise<TrailStatus> => {
  const url = `${baseUrl}/status?trailId=${encodeURIComponent(trailId)}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};
