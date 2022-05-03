import { SET_USERDATA } from "../actions/action-types";

export const userDateReducer = (state = {}, action: any) => {
  if (action.type === SET_USERDATA) {
    return {
      ...state,
      ...action.userData
    };
  }
  return state;
};