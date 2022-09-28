import CsLineIcons from 'cs-line-icons/CsLineIcons';
import React from 'react';
import { Button, Card, Modal, Row, Col } from 'react-bootstrap';
import {getImage, Images} from 'services/Images';
import UserService from 'services/UserService';
import './icon.css';

class AvatarComponent extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      ChangeAvatar : false,
      Avatar : this.getAvatar(),
    }
  }

  getAvatar() {
    return getImage(UserService.getProfileData()?.avatar);
  }

  setAvatar(Avatar) {
    this.setState({
      Avatar
    })
  }


  cancelAvatar(){
    this.setState({
      Avatar : this.getAvatar()
    })
   this.switchAvatar(false)
  }

  SubmitAvatar(){
    if(this.state.Avatar == null){
      return 
    }
    const profile = UserService.getProfileData();
    profile.avatar = this.state.Avatar;
    UserService.profile(profile).then(() => {
      UserService.setProfileData(profile)
        this.switchAvatar(false)
    })
  }

  switchAvatar(state) {
    this.setState({
      ChangeAvatar : state
    })
  }

    componentDidMount() {
        this.setState({
            Avatar : this.getAvatar()
        })
    }

render(){
  const avatarList = []
  Images.forEach((image) => {
    avatarList.push((
    
        <Col xs="6" sm="2" key={image} >
            <img src={"/img/profile/"+ image}  width="100" height="100" onClick={() => this.setAvatar(image)} className="img-fluid rounded-xl m-1" alt="thumb" />
        </Col>
    ))
  })

  return (
    
    <>
        <a>
                      <img src={"/img/profile/"+ this.state.Avatar} className="img-fluid rounded-xl" alt="thumb" />
                      <span className="icons" onClick={() => this.switchAvatar(true)} ><CsLineIcons icon="camera" /></span>
        </a>
            <Card>
              <Modal body size="lg" show={this.state.ChangeAvatar} onHide={() => this.switchAvatar(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Choose your avatar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                    {avatarList}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.cancelAvatar()}>
                    Cancel
                  </Button>
                  <Button onClick={() => this.SubmitAvatar()}>Save</Button>
                </Modal.Footer>
              </Modal>
            </Card>
    </>
  );
}
};

export default AvatarComponent;
