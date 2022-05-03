import { SELECTED_CATEGORY } from "../actions/action-types";

export const selectedCategoryReducer = (state = {}, action: any) => {
    if (action.type === SELECTED_CATEGORY) {
      return {
        ...state,
        ...action.selected
      };
    }
    return state;
};