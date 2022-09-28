import React from 'react';
import { friendService } from 'services';

export default class ProfileFriendComponent extends React.Component {

    friendRequest = {
        firstUser: "628e6fb89cf56b3c42dc5941",
        secondUser: "62b9731b8861130d7319e195"
    }

    constructor(props) {
        super(props)
       // this.createFriendRequest().then(() => {
            this.getFriendByUsers().then(friend => {
              //  this.acceptFriendRequest().then(() => {
                    //this.friendRequest = friend.data
                    this.friendRequestExists()
                    this.getFriendRequestById()
                    this.getSentFriendRequests()
                    this.getReceivedFriendRequests()
                    this.getMyFriendsList()
                    this.isUserFriend()
             //   })
            })
        //})
    }

    createFriendRequest() {
        return friendService.post(this.friendRequest)
    }

    acceptFriendRequest() {
        return friendService.AcceptFriendRequest(this.friendRequest)
    }

    blockFriendRequest() {
        return friendService.BlockFriendRequest(this.friendRequest)
    }

    unfriend() {
        return friendService.Unfriend(this.friendRequest)
    }

    getFriendByUsers() {
        return friendService.getFriendByUsers(
            this.friendRequest.firstUser,
            this.friendRequest.secondUser
        )
    }

    friendRequestExists() {
        return friendService.friendRequestExists(
            this.friendRequest.firstUser,
            this.friendRequest.secondUser
        )
    }

    getFriendRequestById() {
        return friendService.get(this.friendRequest.id)
    }

    getSentFriendRequests() {
        return friendService.getSentFriendRequests()
    }

    getReceivedFriendRequests() {
        return friendService.getReceivedFriendRequests()
    }

    getMyFriendsList() {
        return friendService.getMyFriendsList()
    }

    isUserFriend() {
        return friendService.isUserFriend(
            this.friendRequest.firstUser,
            this.friendRequest.secondUser
        )
    }

    render() {
        return (
            <>
            </>
        )
    }
}
