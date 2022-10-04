import axios from 'axios';
import StorageService from './StorageService';
import authService from './authService';


const API_URL = 'http://localhost:8080';

const ProfileDataKey = "ProfileData";
const getProfileData = () => {
  return StorageService.getObject(ProfileDataKey)
}

const setProfileData = (ProfileData) =>{
    StorageService.setObject(ProfileDataKey, ProfileData);
  }

const profile = (profile) => {
  const user = authService.getCurrentUser();
    profile.idUser = user.id;
    return axios.post(`${API_URL}/user/profile/edit`, profile,
    {
      headers: {
        token: user.token
      }
    })
  }

const getProfileById = (idProfile) => {
  const user = authService.getCurrentUser();
  return axios.get(`${API_URL}/user/profile/${idProfile}`, {
    headers : {
      token : user.token
    }
  })
}

const getUsers = () => {
    const user = authService.getCurrentUser();
    return axios.get(`${API_URL}/user/all`, {
        headers: {
            token : user.token
        }
    })
}

const getUsersByRole = () => {
  const user = authService.getCurrentUser();
  return axios.get(`${API_URL}/user/all`, {
      headers: {
          token : user.token
      }
  })
}

const LockUser = (id) => {
  const user = authService.getCurrentUser();
    return axios.put(`${API_URL}/user/lock`, null, {
    params : {
      id,
    },
    headers: {
            token : user.token
        }
    })
}

const UnLockUser = (id) => {
  const user = authService.getCurrentUser();
    return axios.put(`${API_URL}/user/unlock`, null, {
      params : {
        id,
      },
      headers: {
            token : user.token
        }
    })
}

const isUserAdmin = (id) => {
    return axios.get(`${API_URL}/user/getRole`, null, {
      params : {
        id,
      }
    })
}

const LoadProfile = () => {
    const user = authService.getCurrentUser();
    return axios.get(`${API_URL}/user/profile`, {
        headers: {
          token : user.token
        }
      }).then(
        (response) => {
          setProfileData(response.data);
        }
      )
    }


  
export default {
    profile,
    getProfileData,
    setProfileData,
    getProfileById,
    LoadProfile,
    getUsers,
    getUsersByRole,
    LockUser,
    UnLockUser,
    isUserAdmin
}
