import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router';
import LandingPage from './landing-page/LandingPage';
import Menu from './restaurant/menu/Menu';
import Orders from './restaurant/orders/Orders';
import { useGlobalContext } from '../context/GlobalContext';
import { addNewOrder } from '../context/actions';
import { OrdersModel } from '../context/models';
import MainAppBar from './MainAppBar';
import Cookies from './cookies/Cookies';
import BottomBar from './bottom-bar/BottomBar';
import PrivacyPolicy from './cookies/PrivacyPolicy';
import Terms from './cookies/Terms';

const MainApp: React.FC = () => {
  const { state, dispatch } = useGlobalContext();

  useEffect(() => {
    if (state.isAdmin) {
      state.socket.on('new_order', (order: OrdersModel) => {
        console.log('ORDER EFFECT: ' + order.id);
        dispatch(addNewOrder(order));
      });
      return () => {
        state.socket.off('new_order');
      };
    }
  }, [state.socket, dispatch, state.isAdmin]);
  return (
    <div>
      <MainAppBar />

      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/cookies" component={Cookies} />
        <Route exact path="/terms" component={Terms} />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />

        {state.isAdmin && <Route exact path="/menu" component={Menu} />}
        {state.isAdmin && <Route exact path="/orders" component={Orders} />}
      </Switch>
      <BottomBar />
    </div>
  );
};

export default MainApp;
