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

export const getTrailStatus = async (trailId: string): Promise<TrailStatus> => {
  const url = `${baseUrl}/status?trailId=${encodeURIComponent(trailId)}`;
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
  maxWidth: string = '',
): Promise<InstagramEmbed> => {
  const url = `https://api.instagram.com/oembed/?url=${instagramPermalink}&maxwidth=${maxWidth}&omitscript=true`;
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};
