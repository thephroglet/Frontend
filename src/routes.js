/* eslint-disable */
import { lazy } from 'react';
import { DEFAULT_PATHS } from 'config.js';
import UserService from 'services/UserService';

const dashboards = {
  index: lazy(() => import('views/dashboards/Dashboards')),
  default: lazy(() => import('views/dashboards/DashboardsDefault')),
  visual: lazy(() => import('views/dashboards/DashboardsVisual')),
  blog: lazy(() => import('views/dashboards/Blog')),
  anaylsedfile: lazy(() => import('views/dashboards/AnalysedFile')),
  help: lazy(() => import('views/dashboards/Help')),
  support: lazy(() => import('views/dashboards/Support')),
  analytic: lazy(() => import('views/dashboards/DashboardsAnalytic'))
};

  const adminDashboard = {
    index: lazy(() => import('views/dashboards/AdminDashboards/MainDashboard')),
    chat: lazy(() => import('views/dashboards/AdminDashboards/ChatRoomVisual')),
    admin : lazy(() => import('views/dashboards/AdminDashboards/AdminProfile'))
  };

  const apps = {
    chat: lazy(() => import('views/apps/chat/Chat'))
  }


const pages = {
  index: lazy(() => import('views/pages/Pages')),
  authentication: {
    index: lazy(() => import('views/pages/authentication/Authentication')),
    login: lazy(() => import('views/pages/authentication/Login')),
    register: lazy(() => import('views/pages/authentication/Register')),
    forgotPassword: lazy(() => import('views/pages/authentication/ForgotPassword')),
    resetPassword: lazy(() => import('views/pages/authentication/ResetPassword')),
    updatepassword: lazy(() => import('views/pages/authentication/UpdatePassword')),
    verifypassword: lazy(() => import('views/pages/authentication/VerifyPassword')),
    confirmacc: lazy(() => import('views/pages/authentication/Confirm')),

  },
  portfolio: {
    index: lazy(() => import('views/pages/portfolio/Portfolio')),
    home:  lazy(() => import('views/pages/portfolio/PortfolioHome')),
    detail: lazy(() => import('views/pages/portfolio/PortfolioDetail')),
  },
  profile: {
    index: lazy(() => import('views/pages/profile/Profile')),
    standard: lazy(() => import('views/pages/profile/ProfileStandard')),
    settings: lazy(() => import('views/pages/profile/ProfileSettings')),
    profileedit: lazy(() => import('views/pages/profile/ProfileEdit')),
    profileFriends : lazy(() => import('views/pages/profile/ProfileFriends')),
    userProfile : lazy(() => import('views/pages/profile/PublicUserProfile')),
    MyProfile : lazy(() => import('views/pages/profile/PublicUserProfile')),


  },
  blog: {
    post: lazy(() => import('views/pages/blog/BlogPost')),
  }
  
};

const support = {
    question: lazy(() => import('./components/SupportComponent/SingleQuestionComponent')),
};

const connected = UserService.getProfileData();
const appRoot = DEFAULT_PATHS.APP.endsWith('/') ? DEFAULT_PATHS.APP.slice(1, DEFAULT_PATHS.APP.length) : DEFAULT_PATHS.APP;

const routesAndMenuItems = {
  mainMenuItems: [
    {
      path: DEFAULT_PATHS.APP,
      exact: true,
      redirect: true,
      to: `${appRoot}/dashboard`,
    },
    {
      path: `/dashboard`,
      component: dashboards.default,
    },
    {
      path: '/admin/dashboard',
      component: adminDashboard.index,
    },
    {
      path: '/chat',
      component: adminDashboard.chat,
    },
    {
      path: '/oops',
      component: adminDashboard.admin,
    },
    {
      path: '/analysis/:uploadedFileId',
      component: dashboards.anaylsedfile,
    },
    {
      path: '/blog/post/:id',
      component: pages.blog.post,
    },
    {
      path: '/blog',
      component: dashboards.blog,
    },
    {
      path: '/support/question/:id',
      component: support.question,
    },
    {
      path: '/support',
      component: dashboards.support,
    },
    {
      path: '/default',
      component: dashboards.default,
    },
    {
      path: '/profile/edit',
      component: pages.profile.profileedit,
    },
    {
      path: '/profile/:id',
      component: pages.profile.userProfile,
    },
    {
      path: '/profile/friends',
      component: pages.profile.profileFriends,
    },
    {
      path: '/contact/chat',
      component: apps.chat
    },
    {
      path: '/analytic',
      component: dashboards.analytic,
    },
    {
      path: '/visual',
      component: dashboards.visual,
    },
    {
      path: '/register',
          component: pages.authentication.register,
          noLayout: true,
         
    },
    {
      path: '/updatepwd',
          component: pages.authentication.updatepassword,
          noLayout: true,
         
    },
    {
      path: '/updatepassword',
          component: pages.authentication.resetPassword,
          noLayout: true,
         
    },
    {
      path: '/verifypassword',
          component: pages.authentication.verifypassword,
          noLayout: true,
    },
    {
      path: '/confirm',
          component: pages.authentication.confirmacc,
          noLayout: true,
    },
    {
      path: '/help',
          component: dashboards.help,
          noLayout: false,
    },
    {
      path: `${appRoot}/profile/${connected?.id}`,
      icon : 'user',
      label: 'Profile',
      component: pages.profile.MyProfile,
    },

  ],
  sidebarItems: [
    { path: '#connections', label: 'menu.connections', icon: 'diagram-1', hideInRoute: true },
  ],
};
export default routesAndMenuItems;
