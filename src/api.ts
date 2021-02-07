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
}

export interface DeviceChannel {
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

const thinkSpeakApi = 'https://api.thingspeak.com';

export const getDeviceChannel = async (
  channeldId: string,
): Promise<DeviceChannel> => {
  const url = `${thinkSpeakApi}/channels/${channeldId}/feeds.json?results=1&timezone=America%2FNew_York`;
  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`Failed to fetch from ${url} with status ${resp.status}`);
  }

  return await resp.json();
};
