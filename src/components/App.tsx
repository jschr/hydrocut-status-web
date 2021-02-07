import React, { useEffect, useCallback, useState } from 'react';
import { useLocalStorage } from 'react-use-storage';
import 'nprogress/nprogress.css';
import nprogress from 'nprogress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Link from '@material-ui/core/Link';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import FavoriteIcon from '@material-ui/icons/Favorite';
import firebase from 'firebase';
import { subscribeToRegion, unsubscribeToRegion } from '../api';
import Metric from './Metric';
import Temp from './Temp';
import useRegionStatus from './useRegionStatus';
import useAirTemp from './useAirTemp';
import useGroundTemp from './useGroundTemp';
import StatusTitle from './StatusTitle';
import StatusCard from './StatusCard';
import HydrocutLogo from './HydrocutLogo';
import TreeLine from './TreeLine';

nprogress.configure({ showSpinner: false });

firebase.initializeApp({
  apiKey: 'AIzaSyB8746JQGyjagRfPCUboKcWnzP--OmUckU',
  authDomain: 'trailstatusapp-production.firebaseapp.com',
  projectId: 'trailstatusapp-production',
  storageBucket: 'trailstatusapp-production.appspot.com',
  messagingSenderId: '329321943885',
  appId: '1:329321943885:web:a90c95fab8a047ef129d04',
  measurementId: 'G-0PJ811WMHN',
});

const vapidKey =
  'BG1Tm4hLfSQn435DjiA2LPxRWMn07PLStBYqhuYhfzumAWphUehz-sq6zofv73qs48dDUwKSs7Em4tV8X8Bdx24';

firebase.analytics();

let messaging: firebase.messaging.Messaging | null = null;

if (firebase.messaging.isSupported()) {
  messaging = firebase.messaging();

  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
  });
}

// const regionId = '760dc476-1800-4a99-9925-ffe5a2c4a5b7'; // Jordan production
// const regionId = '742315bf-6f4a-4b7f-b505-a6b4d4aedd7a'; // Jordan dev
// const regionId = 'b3ece971-a484-4e99-a0d4-13c94875718d'; // Hydrocut dev
const regionId = 'da89b866-ef8d-4853-aab3-7c0f3a1c2fbd'; // Hydrocut production

const App = () => {
  const classes = useStyles();

  const [regionStatus, daysSinceLastChange] = useRegionStatus(regionId);
  const [airTemp] = useAirTemp();
  const [groundTemp] = useGroundTemp();

  const [isLoaded, setIsLoaded] = useState(false);

  const [allowNotifications, setAllowNotifications] = useLocalStorage(
    'notifications',
    false,
  );

  const toggleNotifications = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!messaging) return;

      const checked = event.target.checked;
      setAllowNotifications(checked);

      if (checked) {
        try {
          const token = await messaging.getToken({ vapidKey });
          await subscribeToRegion(regionId, token);
        } catch (err) {
          console.error('Failed to subscribe to region', err);
          setAllowNotifications(false);
        }
      } else {
        try {
          const token = await messaging.getToken({ vapidKey });
          await messaging.deleteToken();
          await unsubscribeToRegion(regionId, token);
        } catch (err) {
          console.error('Failed to unsubscribe to region', err);
          setAllowNotifications(true);
        }
      }
    },
    [setAllowNotifications],
  );

  useEffect(() => {
    if (regionStatus) {
      setIsLoaded(true);
      nprogress.done();
    } else {
      nprogress.start();
    }
  }, [regionStatus]);

  return (
    <>
      <div className={classes.main}>
        <Container maxWidth="sm" className={classes.title}>
          <StatusTitle regionStatus={regionStatus} />
        </Container>

        <Container maxWidth="sm" className={classes.metrics}>
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
        </Container>

        <div className={classes.cardContainer}>
          <div className={classes.treeline}>
            <TreeLine />
          </div>

          <Container maxWidth="sm" className={classes.card}>
            <StatusCard regionStatus={regionStatus} />
            <div className={classes.logo}>
              <HydrocutLogo />
            </div>
          </Container>
        </div>
      </div>

      <div className={classes.footer}>
        <Container maxWidth="sm">
          <Grid container spacing={4}>
            {messaging && (
              <Grid item sm={7} xs={12}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        color="primary"
                        checked={allowNotifications}
                        onChange={toggleNotifications}
                      />
                    }
                    label="Notifications"
                  />
                  <FormHelperText>
                    {allowNotifications
                      ? 'You will receive status notifications in this browser'
                      : 'You will not receive any status notifications'}
                  </FormHelperText>
                </FormGroup>
              </Grid>
            )}

            <Grid item sm={5} xs={12} className={classes.links}>
              <Button
                size="small"
                color="primary"
                variant="contained"
                component="a"
                href="https://donorbox.org/friends-of-the-hydrocut"
                startIcon={<FavoriteIcon />}
              >
                Donate
              </Button>

              <Link color="inherit" href="https://www.thehydrocut.ca">
                thehydrocut.ca
              </Link>
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className={classes.loading} style={{ opacity: isLoaded ? 0 : 1 }} />
    </>
  );
};

const useStyles = makeStyles((theme) => {
  const darkGreen = '#23420e';
  const logoHeight = 130;
  const logoHeightXS = 100;

  return {
    '@global': {
      html: {
        fontSize: 16,
        height: '100%',
      },

      body: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: `${darkGreen} !important`,
      },

      '#root': {
        flex: 1,
      },

      '#nprogress .bar': {
        background: theme.palette.primary.main,
      },

      '#nprogress .peg': {
        boxShadow: `0 0 10px ${theme.palette.primary.main}, 0 0 5px ${theme.palette.primary.main}`,
      },

      '#nprogress .spinner-icon': {
        borderTopColor: theme.palette.primary.main,
        borderLeftColor: theme.palette.primary.main,
      },
    },

    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.palette.background.default,
    },

    title: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: theme.spacing(4),
    },

    metrics: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
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

    cardContainer: {
      position: 'relative',
      width: '100%',
      marginTop: theme.spacing(4),
    },

    treeline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 0,
      height: 100,
    },

    card: {
      position: 'relative',
      zIndex: 10,
      marginBottom: logoHeight / 2,

      [theme.breakpoints.down('xs')]: {
        marginBottom: logoHeightXS / 2,
      },
    },

    logo: {
      position: 'absolute',
      zIndex: 20,
      bottom: 0,
      left: 0,
      width: '100%',
      height: logoHeight,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transform: 'translateY(50%)',
      pointerEvents: 'none',

      [theme.breakpoints.down('xs')]: {
        height: logoHeightXS,
      },
    },

    footer: {
      width: '100%',
      backgroundColor: darkGreen,
      color: 'rgba(255, 255, 255, 0.75)',
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),

      [theme.breakpoints.down('xs')]: {
        paddingBottom: theme.spacing(2),
      },
    },

    links: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',

      [theme.breakpoints.down('xs')]: {
        justifyContent: 'space-between',
      },

      '& > *': {
        marginRight: theme.spacing(2),
      },
      '& > *:last-child': {
        marginRight: 0,
      },
    },

    loading: {
      position: 'fixed',
      zIndex: 100,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      backgroundColor: theme.palette.background.default,
      transition: 'opacity 0.35s ease-in',
    },
  };
});

export default App;
