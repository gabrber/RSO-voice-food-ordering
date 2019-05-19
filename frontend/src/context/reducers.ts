import { ADD_MENU_ITEM, ActionTypes } from "./actions";
import { MenuModel } from "./models";

export const globalReducer: React.Reducer<MenuModel, ActionTypes> = (
  state,
  action
) => {
  switch (action.type) {
    case ADD_MENU_ITEM:
      return Object.assign({}, state, {
        menu: state.menu.concat(action.payload)
      });
  }
};
