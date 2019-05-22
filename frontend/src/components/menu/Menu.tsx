import React, { useContext, useEffect, useState } from 'react';
import openSocket from 'socket.io-client';

import {
  Typography,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { GlobalContext } from '../../context/GlobalContext';
import { addMenuItem } from '../../context/actions';
import { PizzaModel } from '../../context/models';

const useStyles = makeStyles({
  tableRoot: {
    '& img': {
      height: '50px'
    }
  },
  tableRow: {
    height: '50px'
  }
});

const Menu: React.FC = () => {
  const classes = useStyles();
  const [socket, setSocket] = useState(openSocket('http://localhost:1337'));
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    // dispatch(addMenuItem({ id: 1 }));
    socket.emit('hello', 'kappa');
  }, []);

  return (
    <Table className={classes.tableRoot}>
      <TableHead>
        <TableRow>
          <TableCell>Image </TableCell>
          <TableCell>Id</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Price</TableCell>
          <TableCell>Ingredients</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {state.menu.map((menuItem: PizzaModel) => (
          <TableRow key={menuItem.id} className={classes.tableRow}>
            <TableCell component="th" scope="row">
              <img src={menuItem.pizza_img} alt="margherita" />
            </TableCell>
            <TableCell>{menuItem.id}</TableCell>
            <TableCell>{menuItem.name}</TableCell>
            <TableCell>
              {menuItem.price_small} <br />
              {menuItem.price_big}
            </TableCell>
            <TableCell>{menuItem.ingredients}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Menu;
