import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import InstagramIcon from '@material-ui/icons/Instagram';
import React from 'react';
import { RegionStatus } from '../api';

export interface StatusTitleProps {
  regionStatus: RegionStatus | null;
}

const StatusCard = ({ regionStatus }: StatusTitleProps) => {
  const classes = useStyles();

  return (
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
            {regionStatus?.message}
          </Typography>
        </CardContent>

        <div className={classes.imageContainer}>
          {regionStatus && (
            <img
              className={classes.image}
              src={regionStatus.imageUrl ?? ''}
              alt=""
            />
          )}
        </div>

        <CardActions className={classes.cardActions}>
          <div style={{ flex: 1 }} />
          <InstagramIcon color="inherit" />
          {/* <Button
            size="small"
            color="inherit"
            startIcon={<InstagramIcon />}
            className={classes.cardAction}
          >
            Open In Instagram
          </Button> */}
        </CardActions>
      </CardActionArea>
    </Card>
  );
};

const useStyles = makeStyles((theme) => ({
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

  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.type === 'dark' ? '#383838' : '#f8f8f8',
    width: '100%',
  },

  image: {
    maxWidth: '100%',
    backgroundSize: 'contain',
  },

  message: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  cardActions: {
    display: 'flex',
    justifyContent: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.secondary,
    fontWeight: 400,
    width: '100%',
  },
}));

export default StatusCard;
