import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

// import layout
import Layout from 'layout/Layout';

// import routing modules
import RouteIdentifier from 'routing/components/RouteIdentifier';
import { getRoutes } from 'routing/helper';
import routesAndMenuItems from 'routes.js';
import Loading from 'components/loading/Loading';
import AuthenticateRoute from 'routing/components/AuthenticatedRoute';
import ChatBotComponent from 'components/chatbot/ChatBotComponent';
import ChatRedirectButton from 'views/apps/chat/components/RedirectButton';


const App = () => {
  const { currentUser, isLogin } = useSelector((state) => state.auth);

  const routes = useMemo(() => getRoutes({ data: routesAndMenuItems, isLogin, userRole: currentUser.role }), [isLogin, currentUser]);
  if (routes) {
      return (
       <>
        <Layout>
          <AuthenticateRoute>
            <RouteIdentifier routes={routes} fallback={<Loading />} />
          </AuthenticateRoute>
        </Layout>
        <ChatBotComponent/>
        <ChatRedirectButton />
       </>
      );
  }
  return <>
  
  </>;
};

export default App;
