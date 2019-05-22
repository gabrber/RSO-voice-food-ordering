import { ADD_MENU_ITEM, ActionTypes } from './actions';
import { GlobalModel } from './models';

export const globalReducer: React.Reducer<GlobalModel, ActionTypes> = (
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
