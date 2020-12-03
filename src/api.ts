const baseUrl = 'https://api.trailstatusapp.com';

export interface User {
  userId: string;
  username: string;
}

export interface TrailStatus {
  id: string;
  status: 'open' | 'closed';
  imageUrl: string;
  message: string;
  instagramPostId: string;
  instagramPermalink: string;
  updatedAt: string;
  user: User;
}

export const getRegionStatus = async (id: string): Promise<TrailStatus> => {
  const url = `${baseUrl}/regions/status?id=${id}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};

export interface InstagramEmbed {
  html: string;
  width: number;
}

export const getInstagramEmbed = async (
  instagramPermalink: string,
  maxWidth?: number,
): Promise<InstagramEmbed> => {
  const url = `https://api.instagram.com/oembed/?url=${instagramPermalink}&maxwidth=${
    maxWidth || ''
  }&omitscript=true`;
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};
