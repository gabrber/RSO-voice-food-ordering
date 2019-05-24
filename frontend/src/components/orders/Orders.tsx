import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import { useGlobalContext } from '../../context/GlobalContext';
import { OrdersModel } from '../../context/models';
import { addNewOrder, setNewMenu } from '../../context/actions';

const Orders: React.FC = () => {
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    state.socket.on('new_order', (order: OrdersModel) => {
      console.log('ORDER EFFECT: ' + order.id);
      dispatch(addNewOrder(order));
    });
    return () => {
      state.socket.off('new_order');
    };
  }, [state.socket, dispatch]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Id</TableCell>
          <TableCell>Zamówienie</TableCell>
          <TableCell>Adres</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {state.orders.map((order: OrdersModel) => (
          <TableRow key={order.id}>
            <TableCell component="th" scope="row">
              {order.id}
            </TableCell>
            <TableCell>
              {order.orders.map((orderItem: OrdersModel['orders'][0]) => {
                return (
                  <p>
                    {orderItem.id} + {orderItem.name} + {orderItem.size}
                  </p>
                );
              })}
            </TableCell>
            <TableCell>
              <div>
                {order.address.city}, {order.address.street}{' '}
                {order.address.building}/{order.address.flat}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Orders;
