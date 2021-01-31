import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface MetricProps {
  label: React.ReactNode;
  value: React.ReactNode;
}

const Metric = ({ label, value }: MetricProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.value}>{value || '-'}</div>
      <div className={classes.label}>{label}</div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
  },
  value: {
    fontSize: '1.5rem',
    '@media (max-width: 460px)': {
      fontSize: '1.25rem',
    },
  },
  label: {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
}));

export default Metric;
