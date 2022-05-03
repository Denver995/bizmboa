import { RELOAD_FAVORIS } from "../actions/action-types";

export const reloadFavorisReducer = (state = false, action: any) => {
    if (action.type === RELOAD_FAVORIS) {
      return !state;
    }
    return state;
};