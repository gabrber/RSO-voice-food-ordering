import React, { useEffect } from 'react';
import MaterialTable from 'material-table';

import { Button } from '@material-ui/core';
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

const columns = [
  {
    title: 'Zdjęcie',
    field: 'pizza_img',
    render: (rowData: PizzaModel) => (
      <img
        src={rowData.pizza_img}
        alt="pizza"
        style={{ width: '100px', borderRadius: '50%' }}
      />
    )
  },
  { title: 'ID', field: 'id' },
  { title: 'Nazwa', field: 'name' },
  {
    title: 'Cena',
    field: 'price_small',
    render: (rowData: PizzaModel) => {
      return (
        <div>
          {rowData.price_small} <br />
          {rowData.price_big}
        </div>
      );
    }
  },
  {
    title: 'Składnki',
    field: 'ingredients',
    render: (rowData: PizzaModel) => {
      return (
        <ul>
          {rowData.ingredients.map(ingredient => {
            return <li>{ingredient}</li>;
          })}
        </ul>
      );
    }
  }
];

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
      <MaterialTable title="Menu" columns={columns} data={state.menu} />

      <Button onClick={() => state.socket.emit('new_menu')}>Kappa</Button>
    </div>
  );
};

export default Menu;
