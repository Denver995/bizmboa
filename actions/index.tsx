import { 
  SET_CONFIG,
  FAILED_APP,
  START_LOADING,
  STOP_LOADING,
  SET_USERDATA,
  SELECTED_ARTICLE,
  SELECTED_CATEGORY,
  SHOW_ARTICLE_DETAIL,
  SHOW_ARTICLE_FORM,
  SHOW_ARTICLES_BY_CATEGORY,
  SHOW_FILTER_FORM,
  TOGGLE_FAVORITE,
  RELOAD_FAVORIS,
  SELECTED_SHOP
 } from "./action-types";

export const toggleFavoris = (favoris: any) => ({
  type: TOGGLE_FAVORITE,
  favoris
});


export const setConfig = (config: any) => ({
  type: SET_CONFIG,
  config
});

export const setUserData = (userData: any) => ({
  type: SET_USERDATA,
  userData
});

export const startLoading = () => ({
  type: START_LOADING
});

export const stopLoading = () => ({
  type: STOP_LOADING
});

export const failedApp = () => ({
  type: FAILED_APP
});

export const setSelectedArticle = (selected: any) => ({
  type: SELECTED_ARTICLE,
  selected
});

export const setSelectedCategory = (selected: any) => ({
  type: SELECTED_CATEGORY,
  selected
});

export const setSelectedShop = (selected: any) => ({
  type: SELECTED_SHOP,
  selected
});

export const showArticleDetail = (show: boolean) => ({
  type: SHOW_ARTICLE_DETAIL,
  show
});



export const showArticleForm = (actionType: any) => ({
  type: SHOW_ARTICLE_FORM,
  actionType
});

export const showArticleByCategory = (show: boolean) => ({
  type: SHOW_ARTICLES_BY_CATEGORY,
  show
});

export const showFilterForm = (show: boolean) => ({
  type: SHOW_FILTER_FORM,
  show
});

export const reloadFavoritesScreen = (reload: boolean) => ({
  type: RELOAD_FAVORIS,
  reload
})