import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router';
import { LandingPage } from './landing-page/LandingPage';
import Menu from './restaurant/menu/Menu';
import Orders from './restaurant/orders/Orders';
import { useGlobalContext } from '../context/GlobalContext';
import { addNewOrder } from '../context/actions';
import { OrdersModel } from '../context/models';
import MainAppBar from './MainAppBar';

export const MainApp: React.FC = () => {
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    state.socket.on('new_order', (order: OrdersModel) => {
      console.log('ORDER EFFECT: ' + order.id);
      dispatch(addNewOrder(order));
    });
    // return () => {
    //   state.socket.off('new_order');
    // };
  }, [state.socket, dispatch]);
  return (
    <div>
      <MainAppBar />

      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/menu" component={Menu} />
        <Route exact path="/orders" component={Orders} />
      </Switch>
    </div>
  );
};
