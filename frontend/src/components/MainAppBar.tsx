import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ButtonBase
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import logo from '../img/pizza_logo.png';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'black'
  }
});

const MainAppBar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <ButtonBase>
          <Link className={classes.link} to="/">
            <img height="30px" src={logo} alt="logo" />
          </Link>
        </ButtonBase>
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
