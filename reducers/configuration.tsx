import { SET_CONFIG } from "../actions/action-types";
import { defaultConfig } from "../utils/config";

export const configurationReducer = (state = { ...defaultConfig }, action: any) => {
  if (action.type === SET_CONFIG) {
    return {
      ...state,
      ...action.config
    };
  }
  return state;
};