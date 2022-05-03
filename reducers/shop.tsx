import { SELECTED_SHOP } from "../actions/action-types";

export const selectedShopReducer = (state = {}, action: any) => {
    if (action.type === SELECTED_SHOP) {
      return {
        ...state,
        ...action.selected
      };
    }
    return state;
};