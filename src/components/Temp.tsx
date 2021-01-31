import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

interface TempProps {
  value: number;
}

const Temp = ({ value }: TempProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.degrees}>°</div>
      <div className={classes.celcius}>c</div>
      {value}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  degrees: {
    position: 'absolute',
    top: 4,
    right: 0,
    transform: 'translateX(100%)',
    fontSize: '0.5em',
    fontWeight: 500,
  },
  celcius: {
    position: 'absolute',
    top: 2,
    right: -4,
    transform: 'translateX(100%)',
    fontSize: '0.5em',
  },
}));

export default Temp;
