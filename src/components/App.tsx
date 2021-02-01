import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import InstagramIcon from '@material-ui/icons/Instagram';
import FavoriteIcon from '@material-ui/icons/Favorite';
import React, { useEffect, useState, useMemo } from 'react';
import useSWR from 'swr';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { getRegionStatus, getDeviceChannel } from '../api';
import footerImage from '../assets/hydrocut-bg.png';
import Theme from './Theme';
import ShovelIcon from './ShovelIcon';
import Metric from './Metric';
import Temp from './Temp';

const isStaleMetric = (metricDate: string) => {
  const now = new Date();
  const createdAt = new Date(metricDate);
  // Metric is stale if created at is > 4 hours ago.
  return +now - +createdAt > 1000 * 60 * 60 * 4;
};

nprogress.configure({ showSpinner: false });

const App = () => {
  const classes = useStyles();

  const [isLoaded, setIsLoaded] = useState(false);

  const { data: regionStatus, error: regionStatusError } = useSWR(
    'da89b866-ef8d-4853-aab3-7c0f3a1c2fbd',
    getRegionStatus,
    {
      refreshInterval: 60 * 1000,
    },
  );

  if (regionStatusError) {
    console.error('Error fetching region status', regionStatusError);
  }

  const { data: airTempChannel, error: airTempChannelError } = useSWR(
    '738696',
    getDeviceChannel,
    {
      refreshInterval: 60 * 1000,
    },
  );

  if (airTempChannelError) {
    console.error('Error fetching aird temp channel', airTempChannelError);
  }

  const { data: groundTempChannel, error: groundTempChannelError } = useSWR(
    '1191345',
    getDeviceChannel,
    {
      refreshInterval: 60 * 1000,
    },
  );

  if (groundTempChannelError) {
    console.error('Error fetching ground temp channel', groundTempChannelError);
  }

  useEffect(() => {
    if (regionStatus) {
      setIsLoaded(true);
      nprogress.done();
    } else {
      nprogress.start();
    }
  }, [regionStatus]);

  const airTemp = useMemo(() => {
    if (!airTempChannel) return null;
    const latest = airTempChannel?.feeds[0];
    if (!latest) return null;
    if (isStaleMetric(latest.created_at)) return null;
    const temp = Math.round(parseFloat(latest.field3));
    if (isNaN(temp)) return null;
    return temp;
  }, [airTempChannel]);

  const groundTemp = useMemo(() => {
    if (!groundTempChannel) return null;
    const latest = groundTempChannel?.feeds[0];
    if (!latest) return null;
    if (isStaleMetric(latest.created_at)) return null;
    const temp = Math.round(parseFloat(latest.field2));
    if (isNaN(temp)) return null;
    return temp;
  }, [groundTempChannel]);

  const daysSinceLastChange = useMemo(() => {
    if (!regionStatus) return null;
    const now = new Date();
    const updatedAt = new Date(regionStatus.updatedAt);
    return Math.round((+now - +updatedAt) / 1000 / 60 / 60 / 24);
  }, [regionStatus]);

  return (
    <Theme>
      <Container
        className={classes.main}
        maxWidth="sm"
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        <Typography variant="h2" className={classes.status}>
          trails are{' '}
          <Box
            component="span"
            color={
              regionStatus?.status === 'open' ? 'success.main' : 'error.main'
            }
          >
            {regionStatus?.status}
          </Box>
        </Typography>

        <div className={classes.metricsContainer}>
          <Metric
            label="Air Temp"
            value={airTemp !== null && <Temp value={airTemp} />}
          />
          <Metric
            label="Ground Temp"
            value={groundTemp !== null && <Temp value={groundTemp} />}
          />
          <Metric
            label={
              regionStatus?.status === 'closed' ? 'Days Closed' : 'Days Open'
            }
            value={daysSinceLastChange}
          />
        </div>

        <div className={classes.details}>
          {regionStatus && (
            <Card className={classes.card} raised>
              <CardActionArea
                classes={{
                  root: classes.cardActionArea,
                  focusHighlight: classes.cardActionAreaHighlight,
                }}
                href={regionStatus?.instagramPermalink}
                component="a"
              >
                <CardContent className={classes.message}>
                  <Typography variant="body1" color="textPrimary">
                    {regionStatus.message}
                  </Typography>
                </CardContent>
                <img
                  className={classes.image}
                  src={regionStatus.imageUrl ?? ''}
                  alt=""
                />

                <CardActions className={classes.cardActions}>
                  <Button
                    size="small"
                    color="inherit"
                    startIcon={<InstagramIcon />}
                    className={classes.cardAction}
                  >
                    Open In Instagram
                  </Button>
                </CardActions>
              </CardActionArea>
            </Card>
          )}
        </div>
      </Container>

      <div className={classes.footer} style={{ opacity: isLoaded ? 1 : 0 }}>
        <div className={classes.footerImage} />

        <Container className={classes.footerInner} maxWidth="sm">
          <Button
            size="small"
            color="secondary"
            variant="contained"
            component="a"
            href="https://donorbox.org/friends-of-the-hydrocut"
            startIcon={<FavoriteIcon />}
          >
            Donate
          </Button>
          &nbsp; &nbsp;
          <Button
            size="small"
            color="secondary"
            variant="contained"
            component="a"
            href="https://www.thehydrocut.ca/trail-helpers-signup.html"
            startIcon={<ShovelIcon />}
          >
            Volunteer
          </Button>
        </Container>
      </div>
    </Theme>
  );
};

const useStyles = makeStyles((theme) => ({
  '@global': {
    html: {
      fontSize: 16,
      height: '100%',
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

    '#nprogress .bar': {
      background: '#88B64D',
    },

    '#nprogress .peg': {
      boxShadow: `0 0 10px #88B64D, 0 0 5px #88B64D`,
    },

    '#nprogress .spinner-icon': {
      borderTopColor: '#88B64D',
      borderLeftColor: '#88B64D',
    },
  },

  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    opacity: 0,
    transition: 'opacity 1s ease-in',
  },

  status: {
    marginTop: theme.spacing(4),
    fontSize: '3.75rem',
    fontWeight: 300,

    '@media (max-width: 460px)': {
      fontSize: '3rem',
    },
  },

  metricsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(2),

    '& > *': {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    '& > *:first-child': {
      marginLeft: 0,
    },
    '& > *:last-child': {
      marginRight: 0,
    },
  },

  details: {
    // maxWidth: 400,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  card: {
    borderRadius: 8,
  },

  cardActionArea: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  cardActionAreaHighlight: {
    backgroundColor: theme.palette.background.paper,

    '&:focus, &:hover': {
      backgroundColor: theme.palette.background.paper,
    },
  },

  image: {
    maxWidth: '100%',
    backgroundSize: 'contain',
  },

  message: {
    borderBottom: '1px solid rgba(0,0,0,0.1)',
  },

  cardActions: {
    display: 'flex',
    justifyContent: 'center',
    borderTop: '1px solid rgba(0,0,0,0.1)',
    width: '100%',
  },

  cardAction: {
    color: theme.palette.text.secondary,
    fontWeight: 400,
  },

  followLink: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textDecoration: 'none',
  },

  footer: {
    opacity: 0,
    transition: 'opacity 1s ease-in',
    backgroundColor: '#314418',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
  },

  footerImage: {
    flexShrink: 0,
    height: '180px',
    backgroundImage: `url(${footerImage})`,
    backgroundPosition: 'top center',
    backgroundSize: 'contain',

    '@media (max-width: 612px)': {
      height: '100px',
    },
  },

  footerInner: {
    width: '100%',
    alignSelf: 'center',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default App;
