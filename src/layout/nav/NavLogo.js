import React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_PATHS } from 'config.js';
import authService from 'services/authService';

const NavLogo = () => {
  const connected = authService.getCurrentUser()
  let decideWhere = null;
  if(connected?.role === 'ADMIN') {
    decideWhere = '/admin/dashboard'
  }else if(connected?.role === 'USER'){
    decideWhere = '/dashboard'
  }
  return (
    <div className="logo position-relative">
      <Link to={decideWhere}>
        {
         // Logo can be added directly
          <img src="/img/profile/logo.png"  />
         // Or added via css to provide different ones for different color themes
         }
        <div/>
      </Link>
    </div>
  );
};
export default React.memo(NavLogo);
