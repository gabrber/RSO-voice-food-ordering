import { PizzaModel, OrdersModel } from './models';

export const SET_NEW_MENU = 'SET_NEW_MENU';
export const ADD_NEW_ORDER = 'ADD_NEW_ORDER';

export const setNewMenu = (payload: PizzaModel[]) => {
  return {
    type: SET_NEW_MENU,
    payload
  } as const;
};

export const addNewOrder = (payload: OrdersModel) => {
  return {
    type: ADD_NEW_ORDER,
    payload
  } as const;
};
export type ActionTypes = ReturnType<typeof addNewOrder | typeof setNewMenu>;
