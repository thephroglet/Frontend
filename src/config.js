import { LAYOUT, MENU_BEHAVIOUR, NAV_COLOR, MENU_PLACEMENT, RADIUS, THEME_COLOR, USER_ROLE } from 'constants.js';
import authService from 'services/authService';
import UserService from 'services/UserService'

export const IS_DEMO = true;
export const IS_AUTH_GUARD_ACTIVE = true;
export const SERVICE_URL = '/app';
export const USE_MULTI_LANGUAGE = false;

// For detailed information: https://github.com/nfl/react-helmet#reference-guide
export const REACT_HELMET_PROPS = {
  defaultTitle: 'Insight',
  titleTemplate: '%s | Insight',
};

export const DEFAULT_PATHS = {
  APP: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  USER_WELCOME: '/default',
  NOTFOUND: '/page-not-found',
  UNAUTHORIZED: '/unauthorized',
  INVALID_ACCESS: '/invalid-access',
  UPDATEPASSWORD: '/updatepwd',
  CONFIRM_REGISTER : '/confirm'
};

export const DEFAULT_SETTINGS = {
  MENU_PLACEMENT: MENU_PLACEMENT.Horizontal,
  MENU_BEHAVIOUR: MENU_BEHAVIOUR.Pinned,
  LAYOUT: LAYOUT.Fluid,
  RADIUS: RADIUS.Rounded,
  COLOR: THEME_COLOR.LightPurple,
  NAV_COLOR: NAV_COLOR.Default,
  USE_SIDEBAR: false,
};


export const DEFAULT_USER = {
  id: authService.getCurrentUser() != undefined ? authService.getCurrentUser()?.id : "",
  name: authService.getCurrentUser() != undefined ? authService.getCurrentUser()?.firstname + " "+ authService.getCurrentUser()?.lastname: "",
  thumb: "/img/profile/"+(UserService.getProfileData() != null && UserService.getProfileData()?.avatar != undefined ? UserService.getProfileData()?.avatar : "29.png"),
  role: USER_ROLE.User,
  email: authService.getCurrentUser() != undefined ? authService.getCurrentUser()?.email : "",
};

export const REDUX_PERSIST_KEY = 'classic-dashboard';
