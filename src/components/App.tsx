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
import React, { FunctionComponent, useEffect, useState } from 'react';
import TimeAgo from 'timeago-react';
import useSWR from 'swr';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { getRegionStatus } from '../api';
import footerImage from '../assets/hydrocut-bg.png';
import Theme from './Theme';
import ShovelIcon from './ShovelIcon';

const App: FunctionComponent = () => {
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

  useEffect(() => {
    if (regionStatus) {
      // Artificial delay to allow instagram embed to populate before showing.
      setTimeout(() => {
        setIsLoaded(true);
        nprogress.done();
      }, 250);
    } else {
      nprogress.start();
    }
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

        <Typography variant="subtitle1" color="textSecondary">
          updated{' '}
          {regionStatus && <TimeAgo datetime={regionStatus.updatedAt} />}
        </Typography>

        <div className={classes.details}>
          {regionStatus && (
            <Card className={classes.card} raised>
              <CardActionArea
                classes={{ focusHighlight: classes.cardActionAreaHighlight }}
                href={regionStatus?.instagramPermalink}
                component="a"
              >
                <img
                  className={classes.image}
                  src={regionStatus.imageUrl ?? ''}
                  alt=""
                />
                <CardContent className={classes.message}>
                  <Typography variant="body1" color="textPrimary">
                    {regionStatus.message}
                  </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <Button
                    size="small"
                    color="inherit"
                    startIcon={<InstagramIcon />}
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

        <div className={classes.footerInner}>
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
        </div>
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

  status: {
    marginTop: theme.spacing(4),
    fontSize: '3.75rem',
    fontWeight: 300,

    '@media (max-width: 460px)': {
      fontSize: '3rem',
    },
  },

  details: {
    maxWidth: 400,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  card: {
    borderRadius: 8,
  },

  cardActionAreaHighlight: {
    backgroundColor: theme.palette.background.paper,

    '&:focus, &:hover': {
      backgroundColor: theme.palette.background.paper,
    },
  },

  cardActions: {
    display: 'flex',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    paddingBottom: theme.spacing(2),
    paddingTop: 0,
  },

  image: {
    maxWidth: '100%',
    backgroundSize: 'contain',
  },

  message: {
    borderTop: '1px solid rgba(0,0,0,0.15)',
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
    maxWidth: 400,
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
