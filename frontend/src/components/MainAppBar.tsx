import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'red'
  }
});

const MainAppBar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button>
          <Link className={classes.link} to="/menu">
            <Typography>Menu</Typography>
          </Link>
        </Button>
        <Button>
          <Link className={classes.link} to="/orders">
            <Typography>Orders</Typography>
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default MainAppBar;
