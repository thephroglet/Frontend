import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import authService from 'services/authService';

class AuthenticatedRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    if (authService.isUserLoggedIn()) {
      return <Route {...this.props} />;
    }
    return <Redirect to="/login" />;
  }


}
export default AuthenticatedRoute;