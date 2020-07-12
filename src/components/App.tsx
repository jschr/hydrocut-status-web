import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent, useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
import useSWR from 'swr';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { getTrailStatus, getInstagramEmbed } from '../api';
import footerImage from '../assets/hydrocut-bg.png';
import headerImage from '../assets/hydrocut-circle.jpg';
import Theme from './Theme';

const App: FunctionComponent = () => {
  const classes = useStyles();

  const [isLoaded, setIsLoaded] = useState(false);

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
    (permalink) =>
      getInstagramEmbed(
        permalink,
        Math.min(document.body.clientWidth - 20, 400),
      ),
  );

  if (trailStatusError) {
    console.error('Error fetching instagram embed', instagramEmbedError);
  }

  useEffect(() => {
    if (trailStatus && instagramEmbed) {
      (window as any).instgrm.Embeds.process();

      // Artificial delay to allow instagram embed to populate before showing.
      setTimeout(() => {
        setIsLoaded(true);
        nprogress.done();
      }, 250);
    } else {
      nprogress.start();
    }
  }, [trailStatus, instagramEmbed]);

  return (
    <Theme>
      <div className={classes.header}>
        <a href="https://thehydrocut.ca">
          <img src={headerImage} alt="The Hydrocut Trails" />
        </a>
      </div>

      <Container
        className={classes.main}
        maxWidth="sm"
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
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

      <div
        className={classes.footer}
        style={{ opacity: isLoaded ? 1 : 0 }}
      ></div>
    </Theme>
  );
};

const useStyles = makeStyles((theme) => ({
  '@global': {
    html: {
      fontSize: 16,
      height: '100%',

      '@media (max-width: 460px)': {
        fontSize: 13,
      },
    },

    body: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#314418',
    },

    '#root': {
      flex: 1,

      backgroundColor: '#fff',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(6),

    '& > a': {
      width: 80,
      textDecoration: 'none',

      '& > img': {
        maxWidth: '100%',
      },
    },
  },

  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    opacity: 0,
    transition: 'opacity 1s ease-in',
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
    opacity: 0,
    transition: 'opacity 1s ease-in',

    '@media (max-width: 612px)': {
      height: '100px',
    },
  },
}));

export default App;
