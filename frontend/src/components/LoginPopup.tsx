import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import {
  makeStyles,
  Paper,
  TextField,
  Typography,
  Button,
  Grid
} from '@material-ui/core';
import { useGlobalContext } from '../context/GlobalContext';
import { setAdmin } from '../context/actions';

const useStyles = makeStyles({
  grid: {
    minHeight: '100vh'
  },
  paper: {
    padding: '10px'
  },
  text: {
    display: 'block'
  },
  buttonsDiv: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '10px'
  }
});

const LoginPopup: React.FC<{ handleClose: any }> = ({ handleClose }) => {
  const classes = useStyles();
  const { state, dispatch } = useGlobalContext();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['login_cookie']);

  const handleLogin = () => {
    state.socket.emit('login', { login: login, password: password });
    handleClose();
  };

  useEffect(() => {
    state.socket.on('user', (user: string) => {
      console.log(user);
      if (user === 'admin') {
        dispatch(setAdmin(true));
        setCookie('login_cookie', 'admin', { path: '/' });
      }
    });
  }, [state.socket, dispatch, setCookie]);

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignContent="center"
      className={classes.grid}
    >
      <Grid item>
        <Paper className={classes.paper}>
          <Typography variant="h3">Login</Typography>
          <TextField
            className={classes.text}
            label="login"
            value={login}
            onChange={event => setLogin(event.target.value)}
          />
          <TextField
            className={classes.text}
            label="hasło"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <div className={classes.buttonsDiv}>
            <Button onClick={handleLogin}>Login</Button>
            <Button onClick={handleClose}>Cofnij</Button>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPopup;
