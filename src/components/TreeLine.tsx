import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import treeline from '../assets/treeline.png';

const TreeLine = () => {
  const classes = useStyles();
  return <div className={classes.image} />;
};

const useStyles = makeStyles((theme) => ({
  image: {
    height: '100%',
    backgroundImage: `url(${treeline})`,
  },
}));

export default TreeLine;
