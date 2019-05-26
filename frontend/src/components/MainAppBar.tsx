import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  ButtonBase,
  Modal
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import logo from '../img/pizza_logo.png';
import LoginPopup from './LoginPopup';
import { useGlobalContext } from '../context/GlobalContext';
import { setAdmin } from '../context/actions';

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    color: 'black'
  }
});

const MainAppBar: React.FC = () => {
  const classes = useStyles();
  const { state, dispatch } = useGlobalContext();
  const [isLoginModal, setLoginModal] = useState(false);

  const handleOpen = () => setLoginModal(true);
  const handleClose = () => setLoginModal(false);

  const handleLogout = () => {
    state.socket.emit('logout');
    dispatch(setAdmin(false));
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <ButtonBase>
            <Link className={classes.link} to="/">
              <img height="30px" src={logo} alt="logo" />
            </Link>
          </ButtonBase>
          {state.isAdmin && (
            <div>
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
            </div>
          )}

          <div style={{ flexGrow: 1 }} />
          {!state.isAdmin ? (
            <Button className={classes.link} onClick={handleOpen}>
              <Typography>Login</Typography>
            </Button>
          ) : (
            <Button className={classes.link} onClick={handleLogout}>
              <Typography>Logout</Typography>
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Modal open={isLoginModal} onClose={handleClose}>
        <LoginPopup handleClose={handleClose} />
      </Modal>
    </div>
  );
};

export default MainAppBar;
