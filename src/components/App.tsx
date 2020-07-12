import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent, useEffect } from 'react';
import TimeAgo from 'react-timeago';
import useSWR from 'swr';
import { getTrailStatus, getInstagramEmbed } from '../api';
import footerImage from '../assets/hydrocut.png';
import Theme from './Theme';

const App: FunctionComponent = () => {
  const classes = useStyles();

  const { data: trailStatus, error: trailStatusError } = useSWR(
    'instagram|17841402338843416|default',
    getTrailStatus,
    {
      refreshInterval: 60 * 1000,
    },
  );

  if (trailStatusError) {
    console.error('Error fetching trail status', trailStatusError);
  }

  const { data: instagramEmbed, error: instagramEmbedError } = useSWR(
    () => trailStatus?.instagramPermalink ?? null,
    (permalink) => getInstagramEmbed(permalink, '400'),
  );

  if (trailStatusError) {
    console.error('Error fetching instagram embed', instagramEmbedError);
  }

  useEffect(() => {
    if (!instagramEmbed?.html) return;
    (window as any).instgrm.Embeds.process();
  }, [instagramEmbed]);

  return (
    <Theme>
      <Container className={classes.main} maxWidth="sm">
        <Typography variant="h2">
          trails are{' '}
          <Box
            component="span"
            color={
              trailStatus?.status === 'open' ? 'success.main' : 'error.main'
            }
          >
            {trailStatus?.status}
          </Box>
        </Typography>

        <Box color="text.secondary" clone>
          <Typography variant="subtitle1">
            updated {trailStatus && <TimeAgo date={trailStatus.updatedAt} />}
          </Typography>
        </Box>

        <div
          className={classes.embed}
          style={{ width: instagramEmbed?.width }}
          dangerouslySetInnerHTML={{ __html: instagramEmbed?.html ?? '' }}
        />
      </Container>

      <div className={classes.footer}></div>
    </Theme>
  );
};

const useStyles = makeStyles((theme) => ({
  '@global': {
    html: {
      height: '100%',
    },
    body: {
      height: '100%',
    },
    '#root': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  },

  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(12),
  },

  embed: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(12),
  },

  footer: {
    flexShrink: 0,
    height: '220px',
    backgroundColor: '#fff',
    backgroundImage: `url(${footerImage})`,
    backgroundPosition: 'bottom center',
    backgroundSize: 'contain',
    margin: 0,
    padding: 0,
  },
}));

export default App;
