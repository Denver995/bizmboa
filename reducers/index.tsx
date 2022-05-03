import {combineReducers} from 'redux';
import { reloadFavorisReducer } from "./favoris";
import { configurationReducer } from "./configuration";
import { userDateReducer } from './userData';
import { selectedArticleReducer, showArticleReducer, showFormReducer, showFilterFormReducer } from './article';
import { selectedCategoryReducer } from './category';
import { selectedShopReducer } from './shop';

const appReducer = combineReducers({
    reloadFavorisScreen: reloadFavorisReducer,
    configuration: configurationReducer,
    userData: userDateReducer,
    selectedArticle: selectedArticleReducer,
    selectedCategory: selectedCategoryReducer,
    showArticleDetail: showArticleReducer,
    selectedShop: selectedShopReducer,
    showFilterForm: showFilterFormReducer,
    formAction: showFormReducer
});

export const rootReducer = (state: any, action: any) => {
    return appReducer(state, action);
};
