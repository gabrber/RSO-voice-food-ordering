import React, { useEffect } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { useGlobalContext } from '../../../context/GlobalContext';
import { OrdersModel } from '../../../context/models';
import MaterialTable from 'material-table';

const HistoricOrders: React.FC = () => {
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    state.socket.emit('get_orders');
  }, [state.socket]);

  const columns = [
    { title: 'Order ID', field: 'order_id' },
    {
      title: 'Zamówienie',
      field: 'orders',
      render: (rowData: OrdersModel) => {
        return (
          <ul>
            {rowData.orders.map(order => {
              return (
                <li>
                  {order.pizza} + {order.size}
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
    },
    {
      title: 'Status',
      field: 'status',
      render: (rowData: OrdersModel) => {
        return (
          <div>
            {rowData.status === 'finished' ? 'Zakończone' : 'Anulowane'}
          </div>
        );
      }
    }
  ];

  return (
    <MaterialTable
      title="Zamówienia"
      columns={columns}
      // data={state.orders}
      data={state.orders.filter(order => {
        return order.status === 'finished' || order.status === 'cancelled';
      })}
      localization={{
        body: {
          emptyDataSourceMessage: 'Brak pozycji'
        }
      }}
    />
  );
};

export default HistoricOrders;
