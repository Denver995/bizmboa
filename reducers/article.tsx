import { SELECTED_ARTICLE, SHOW_ARTICLE_DETAIL, SHOW_ARTICLE_FORM, SHOW_FILTER_FORM } from "../actions/action-types";
import { CLOSE_FORM} from "../utils/constants";

export const selectedArticleReducer = (state = {}, action: any) => {
    if (action.type === SELECTED_ARTICLE) {
      return {
        ...state,
        ...action.selected
      };
    }
    return state;
};

export const showArticleReducer = (state = false, action: any) => {
    if (action.type === SHOW_ARTICLE_DETAIL) {
      return !state;
    }
    return state;
};

export const showFormReducer = (state = CLOSE_FORM, action: any) => {
  if (action.type === SHOW_ARTICLE_FORM) {
    return action.actionType;
  }
  return state;
};

export const showFilterFormReducer = (state = false, action: any) => {
  if (action.type === SHOW_FILTER_FORM) {
    return action.show;
  }
  return state;
};