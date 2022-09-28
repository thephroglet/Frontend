import axios from 'axios';
import StorageService from './StorageService';

const API_URL = 'http://localhost:8080';

const register = (firstName, lastName, email, password) => {
    return axios.post(`${API_URL}/auth/register`, {
      firstName,
      lastName,
      email,
      password,
    });
  };

const setCurrentUser = (user) => {
    StorageService.setObject('AuthenticatedUser', user);
}

const getCurrentUser = () => {
  return StorageService.getObject("AuthenticatedUser");
  
};

const login = (email, password) => {
    return axios
      .post(`${API_URL}/auth/login`, {
      email,
      password,
      })
      .then((response) => {
        if (response.data) {
            setCurrentUser(response.data)
        }
        return response.data;
      });
  };
 
const updatePassword = (newPwd, newConfirmedPwd) => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')

  return axios.post(`${API_URL}/auth/updatepassword?token=`, {
    newPwd,
    newConfirmedPwd,
  }, {
    headers: {
      token
    }
  }
  );
}

const verifyPassword = (pwd) => {
  const user = getCurrentUser();
  return axios.post(`${API_URL}/auth/verifyPassword`, {
    pwd,
    },
    {
      headers: {
        token : user.token
      }
    }
  );
}

const updatePasswordProfile = (newPwd, newConfirmedPwd) => {
  const user = getCurrentUser()
  return axios.post(`${API_URL}/auth/updatepassword`, {
    newPwd,
    newConfirmedPwd,
    token : user.token
  });
}

const resetPassword = (email) => {
  return axios
  .put(`${API_URL}/auth/resetpassword/${email}`, null,  {
    params:{
      email,
    },
    headers: {
      'Access-Control-Allow-Origin': "http://localhost:8080"
      }
  })
};

const logout = () => {
    window.localStorage.clear();
  };


const isUserLoggedIn = () => {
    const user = getCurrentUser();
  if (user === null) return false;
  return true;
};

const confirmToken = (token) => {
  return axios.get(`${API_URL}/auth/confirm`, {
    params: {
      token
    }
  });
}

  export default {
    register,
    login,
    logout,
    getCurrentUser,
    setCurrentUser,
    resetPassword,
    updatePassword,
    isUserLoggedIn,
    updatePasswordProfile,
    verifyPassword,
    confirmToken,
  };