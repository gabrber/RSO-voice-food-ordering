import React, { useReducer, useContext } from 'react';
import { globalReducer } from './reducers';
import { PizzaModel, GlobalModel } from './models';
import openSocket from 'socket.io-client';
import { ActionTypes } from './actions';

const initialState: GlobalModel = {
  menu: [],
  orders: [],
  socket: openSocket('http://localhost:9999'),
  isAdmin: false
};

const GlobalContext = React.createContext<GlobalModel>(initialState);
const DispatchContext = React.createContext<React.Dispatch<ActionTypes>>(
  () => 0
);

const defaultPizza: PizzaModel = {
  id: 1,
  ingredients: ['ser', 'szynka'],
  name: 'margherita',
  pizza_img:
    'http://www.kingcoconutnegombo.com/media/k2/items/cache/802a9daf23bff040c546f525d4bd22bc_XL.jpg',
  price_big: 25,
  price_small: 20
};

export const GlobalContextProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);
  return (
    <GlobalContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const state = useContext(GlobalContext);
  const dispatch = useContext(DispatchContext);
  return { state, dispatch };
};
