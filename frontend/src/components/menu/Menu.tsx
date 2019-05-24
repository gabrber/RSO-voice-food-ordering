import React, { useContext, useEffect, useState } from 'react';
import openSocket from 'socket.io-client';

import {
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { setNewMenu } from '../../context/actions';
import { PizzaModel } from '../../context/models';
import { useGlobalContext } from '../../context/GlobalContext';

const useStyles = makeStyles({
  tableRoot: {
    '& img': {
      height: '300px'
    }
  },
  ingredients: {
    '& p': {
      margin: 0
    }
  }
});

const Menu: React.FC = () => {
  const classes = useStyles();
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    state.socket.on('menu', (menu: PizzaModel[]) => {
      dispatch(setNewMenu(menu));
    });
    return () => {
      state.socket.off('menu');
    };
  }, [state.socket, dispatch]);

  return (
    <div>
      <Table className={classes.tableRoot}>
        <TableHead>
          <TableRow>
            <TableCell>Zdjęcie</TableCell>
            <TableCell>Id</TableCell>
            <TableCell>Nazwa</TableCell>
            <TableCell>Cena</TableCell>
            <TableCell>Składniki</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state.menu.map((menuItem: PizzaModel) => (
            <TableRow key={menuItem.id}>
              <TableCell component="th" scope="row">
                <img src={menuItem.pizza_img} alt="margherita" />
              </TableCell>
              <TableCell>{menuItem.id}</TableCell>
              <TableCell>{menuItem.name}</TableCell>
              <TableCell>
                {menuItem.price_small} <br />
                {menuItem.price_big}
              </TableCell>
              <TableCell className={classes.ingredients}>
                {menuItem.ingredients.map(ingredient => {
                  return <p>{ingredient}</p>;
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button onClick={() => state.socket.emit('new_menu')}>Kappa</Button>
    </div>
  );
};

export default Menu;
