import React, { FunctionComponent } from 'react';
import useSWR from 'swr';
import { getTrailStatus } from '../api';
import Theme from './Theme';

const App: FunctionComponent = () => {
  const { data, error } = useSWR(
    'instagram|17841402338843416|default',
    getTrailStatus,
    { refreshInterval: 60 * 1000 },
  );

  console.log(data);

  return (
    <Theme>
      <h1>hello, world</h1>
    </Theme>
  );
};

export default App;
