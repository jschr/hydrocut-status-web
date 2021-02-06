import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../assets/hydrocut-logo-shadow.png';

const HydrocutLogo = () => {
  const classes = useStyles();
  return <img alt="" className={classes.image} src={logo} />;
};

const useStyles = makeStyles((theme) => ({
  image: {
    height: '100%',
    userSelect: 'none',
  },
}));

export default HydrocutLogo;
