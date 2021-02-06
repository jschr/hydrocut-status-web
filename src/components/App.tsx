import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

import 'nprogress/nprogress.css';

import React, { useEffect, useState } from 'react';
import nprogress from 'nprogress';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Metric from './Metric';
import Temp from './Temp';
import useRegionStatus from './useRegionStatus';
import useAirTemp from './useAirTemp';
import useGroundTemp from './useGroundTemp';
import StatusTitle from './StatusTitle';
import StatusCard from './StatusCard';
import HydrocutLogo from './HydrocutLogo';
import TreeLine from './TreeLine';
import ShovelIcon from './ShovelIcon';

nprogress.configure({ showSpinner: false });

const App = () => {
  const classes = useStyles();

  const [regionStatus, daysSinceLastChange] = useRegionStatus();
  const [airTemp] = useAirTemp();
  const [groundTemp] = useGroundTemp();

  const [isLoaded, setIsLoaded] = useState(false);

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
        <Container maxWidth="sm" className={classes.links}>
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

          <Button
            size="small"
            color="primary"
            variant="contained"
            component="a"
            href="https://www.thehydrocut.ca/trail-helpers-signup.html"
            startIcon={<ShovelIcon />}
          >
            Volunteer
          </Button>

          <div style={{ flex: 1 }} />

          <Link color="inherit" href="https://www.thehydrocut.ca">
            thehydrocut.ca
          </Link>
        </Container>
      </div>

      <div className={classes.loading} style={{ opacity: isLoaded ? 0 : 1 }} />
    </>
  );
};

const useStyles = makeStyles((theme) => {
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
        backgroundColor: '#23420E !important',
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

      [theme.breakpoints.down('xs')]: {
        height: logoHeightXS,
      },
    },

    footer: {
      width: '100%',
      backgroundColor: '#23420e',
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

      '& > *': {
        marginRight: theme.spacing(1),
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
