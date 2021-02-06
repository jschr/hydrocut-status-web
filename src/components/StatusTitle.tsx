import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { RegionStatus } from '../api';

export interface StatusTitleProps {
  regionStatus: RegionStatus | null;
}

const StatusTitle = ({ regionStatus }: StatusTitleProps) => {
  const classes = useStyles();
  return (
    <Typography variant="h2" className={classes.status}>
      trails are{' '}
      <Box
        component="span"
        color={regionStatus?.status === 'open' ? 'success.main' : 'error.main'}
      >
        {regionStatus?.status}
      </Box>
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  status: {
    fontSize: '3.75rem',
    fontWeight: 300,

    '@media (max-width: 460px)': {
      fontSize: '3rem',
    },
  },
}));

export default StatusTitle;
