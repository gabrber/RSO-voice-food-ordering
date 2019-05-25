import React, { useEffect } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import { useGlobalContext } from '../../context/GlobalContext';
import { OrdersModel } from '../../context/models';
import { addNewOrder, setNewMenu } from '../../context/actions';
import MaterialTable from 'material-table';

const columns = [
  { title: 'ID', field: 'id' },
  {
    title: 'Zamówienie',
    field: 'orders',
    render: (rowData: OrdersModel) => {
      return (
        <ul>
          {rowData.orders.map(order => {
            return (
              <li>
                {order.id} + {order.name} + {order.size}
              </li>
            );
          })}
        </ul>
      );
    }
  },
  {
    title: 'Adres',
    field: 'address',
    render: (rowData: OrdersModel) => {
      return (
        <div>
          {rowData.address.city}, {rowData.address.street}{' '}
          {rowData.address.building}
          {rowData.address.flat ? '/' + rowData.address.flat : ''}
        </div>
      );
    }
  }
];

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
    <MaterialTable
      title="Zamówienia"
      columns={columns}
      data={state.orders}
      localization={{
        body: {
          emptyDataSourceMessage: 'Brak pozycji'
        }
      }}
    />
  );
};

export default Orders;
