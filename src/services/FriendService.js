import APIService from './APIService'
import authService from './authService'

export default class FriendService extends APIService {

    base_path='/friend'

    AcceptFriendRequest(body, config={}) {
        return this.axios.post(`${this.base_path}/accept`, body , config)
    }

    BlockFriendRequest(body, config={}) {
        return this.axios.post(`${this.base_path}/block`, body , config)
    }

    CancelFriendFromList(friendRequestId, config={}) {
        friendRequestId = this.getEntityId(friendRequestId)
        return this.axios.delete(`${this.base_path}/${friendRequestId}/cancel` , config)
    }

    Unfriend(friendRequestId, config={}) {
        friendRequestId = this.getEntityId(friendRequestId)
        return this.axios.delete(`${this.base_path}/${friendRequestId}/unfriend` , config)
    }

    getFriendByUsers(firstUser, secondUser, config={}) {
        return this.axios.get(`${this.base_path}/user`, {
            ...config,
            params: {
                firstUser,
                secondUser,
            }
        })
    }

    friendRequestExists(firstUser, secondUser, config={}) {
        return this.axios.get(`${this.base_path}/friendRequestExists`, {
            ...config,
            params: {
                firstUser,
                secondUser,
            }
        })
    }

    getSentFriendRequests(config={}) {
        return this.axios.get(`${this.base_path}/sentRequests`, config)
    }

    getReceivedFriendRequests(config={}) {
        return this.axios.get(`${this.base_path}/receivedRequests`, config)
    }

    getMyFriendsList(idUser, config={}) {
        idUser = this.getEntityId(idUser)
        idUser = idUser!= null ? idUser : authService.getCurrentUser().id
        return this.axios.get(`${this.base_path}/${idUser}/myfriends`, config)
    }

    getFriendRequest(firstUser, secondUser, config={}) {
        return this.axios.get(`${this.base_path}/requests`, {
            ...config,
            params: {
                firstUser,
                secondUser,
            }
        })
    }

    isUserFriend(firstUser, secondUser, config={}) {
        return this.axios.get(`${this.base_path}/isFriend`, {
            ...config,
            params: {
                firstUser,
                secondUser,
            }
        })
    }

}
