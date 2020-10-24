import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import InstagramIcon from '@material-ui/icons/Instagram';
import React, { FunctionComponent, useEffect, useState } from 'react';
import TimeAgo from 'timeago-react';
import useSWR from 'swr';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import { getTrailStatus } from '../api';
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

  useEffect(() => {
    if (trailStatus) {
      // Artificial delay to allow instagram embed to populate before showing.
      setTimeout(() => {
        setIsLoaded(true);
        nprogress.done();
      }, 250);
    } else {
      nprogress.start();
    }
  }, [trailStatus]);

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

        <Typography variant="subtitle1" color="textSecondary">
          updated {trailStatus && <TimeAgo datetime={trailStatus.updatedAt} />}
        </Typography>

        <div className={classes.details}>
          {trailStatus && (
            <Card elevation={2} className={classes.card}>
              <CardActionArea
                href={trailStatus?.instagramPermalink}
                component="a"
              >
                <CardMedia
                  className={classes.image}
                  image={trailStatus.imageUrl ?? ''}
                />
                <CardContent>
                  <Typography variant="body1" color="textPrimary">
                    {trailStatus.message}
                  </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                  <Button
                    size="small"
                    color="primary"
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

  details: {
    maxWidth: 400,
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  card: {
    marginBottom: theme.spacing(4),
  },

  cardActions: {
    display: 'flex',
    justifyContent: 'center',
  },

  image: {
    height: 400,
    backgroundSize: 'contain',
  },

  followLink: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textDecoration: 'none',
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
