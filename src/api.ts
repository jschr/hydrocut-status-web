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

export interface Feed {
  channel: {
    id: string;
    name: string;
    description: string;
    last_entry_id: number;
    created_at: string;
    updated_at: string;
  } & Fields;
  feeds: Array<{ entry_id: string; created_at: string } & Fields>;
}

interface Fields {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  field7: string;
  field8: string;
}

export const getRegionStatus = async (id: string): Promise<TrailStatus> => {
  const url = `https://api.trailstatusapp.com/regions/status?id=${id}`;
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};

export const getDeviceChannel = async (channeldId: string): Promise<Feed> => {
  const url = `https://api.thingspeak.com/channels/${channeldId}/feeds.json?results=1&timezone=America%2FNew_York`;
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};
