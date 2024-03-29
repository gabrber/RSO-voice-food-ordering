import { ActionTypes, SET_NEW_MENU, ADD_NEW_ORDER, SET_ADMIN } from "./actions";
import { GlobalModel } from "./models";

export const globalReducer: React.Reducer<GlobalModel, ActionTypes> = (
  state,
  action
) => {
  switch (action.type) {
    case SET_NEW_MENU:
      return Object.assign({}, state, {
        menu: action.payload
      });

    case ADD_NEW_ORDER:
      let isOldOrder = state.orders.some(
        value => value.order_id === action.payload.order_id
      );

      if (isOldOrder) {
        let newOrders = state.orders.map((value, index, orders) => {
          if (action.payload.order_id === value.order_id) {
            return action.payload;
          } else {
            return value;
          }
        });
        return Object.assign({}, state, { orders: newOrders });
      }
      return Object.assign({}, state, {
        orders: state.orders.concat(action.payload)
      });

    case SET_ADMIN:
      return { ...state, isAdmin: action.payload };

    default:
      return state;
  }
};
