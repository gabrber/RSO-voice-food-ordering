import { PizzaModel } from "./models";

export const ADD_MENU_ITEM = "ADD_MENU_ITEM";

export const addMenuItem = (payload: PizzaModel) => {
  return {
    type: ADD_MENU_ITEM,
    payload
  } as const;
};
export type ActionTypes = ReturnType<typeof addMenuItem>;
