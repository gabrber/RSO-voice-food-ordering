import React, { useReducer } from 'react';
import { globalReducer } from './reducers';
import { PizzaModel } from './models';

const GlobalContext = React.createContext<any>({
  menu: [{}],
  orders: []
});

const defaultPizza: PizzaModel = {
  id: 1,
  ingredients: ['ser', 'szynka'],
  name: 'margherita',
  pizza_img:
    'http://www.kingcoconutnegombo.com/media/k2/items/cache/802a9daf23bff040c546f525d4bd22bc_XL.jpg',
  price_big: 25,
  price_small: 20
};

const GlobalContextProvider: React.FC = ({ children }) => {
  const context = useReducer(globalReducer, {
    menu: [defaultPizza],
    orders: []
  });
  return (
    <GlobalContext.Provider value={context}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalContextProvider };
