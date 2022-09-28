import React from 'react';
import { Row, Col, Card, Nav,  Tab, Button} from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import Clamp from 'components/clamp';
import authService from 'services/authService';
import AvatarComponent from './components/AvatarComponent';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import {claimService, fileService} from 'services';
import UserService from 'services/UserService';


class ProfileStandard extends React.Component{
 title = 'Profile';
  description = 'Profile';

  constructor(props) {
    super(props)
    this.state = {
      files: [],
      breadcrumbs : [
      { to: '', text: 'Home' },
      ],
      claims: [],
    }
  }



  componentDidMount() {
   /* claimService.getByUserId().then( claims => {
      this.setState({
        claims : claims.data
      })
    })*/

    fileService.getMine().then(file => {
      this.setState({
        files: file.data
      })
      console.log(this.state);
    }) 
  };
      
render(){
  let userurl = UserService.getProfileData()?.linkedin;
  const list = []
  this.state.files.forEach(file => {
    list.push(<li> {file.id} { file.file } </li>)
  })
  return (
    
    <>
      <HtmlHead title="Profile"  />
      {/* Title and Top Buttons Start */}
      <div className="page-title-container">
        <Row>
          {/* Title Start */}
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">Profile</h1>
            <BreadcrumbList items={this.state.breadcrumbs} />
          </Col>
          {/* Title End */}
          <Col md="5" className="d-flex align-items-start justify-content-end">
            <Button variant="outline-primary" href="/profile/edit" className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1">
              <CsLineIcons icon="edit-square" /> <span>Edit</span>
            </Button>
          </Col>
        </Row>
      </div>
      {/* Title and Top Buttons End */}
     

      <Row className="g-5">
        <Tab.Container id="profileStandard" defaultActiveKey="overview">
          {/* Sidebar Start */}
          <Col xl="4" xxl="3">
            <h2 className="small-title">Profile</h2>
            <Card className="mb-5">
              <Card.Body>
                <div className="d-flex align-items-center flex-column mb-4">
                  <div className="d-flex align-items-center flex-column">
                    <div className="sw-12 position-relative mb-3">
                      <AvatarComponent />
                    </div>
                    <div className="h5 mb-0"> {authService.getCurrentUser().firstname + " " + authService.getCurrentUser().lastname}</div>
                    <div className="text-muted">
                      <CsLineIcons icon="email" className="me-1" />
                      <span className="align-middle">{authService.getCurrentUser().email}</span>
                    </div>
                  </div>
                </div>
                <Nav className="flex-column" activeKey="overview">
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="overview">
                    <CsLineIcons icon="activity" className="me-2" size="17" />
                    <span className="align-middle">Overview</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 border-bottom border-separator-light cursor-pointer" eventKey="projects">
                    <CsLineIcons icon="suitcase" className="me-2" size="17" />
                    <span className="align-middle">Projects</span>
                  </Nav.Link>
                  <Nav.Link className="px-0 cursor-pointer"  href="/verifypassword" >
                  <CsLineIcons icon="lock-on" className="me-2" size="17" />
                 <span className="align-middle">Update Password</span>
                 </Nav.Link>
                  <Nav.Link className="px-0 cursor-pointer" eventKey="about">
                    <CsLineIcons icon="user" className="me-2" size="17" />
                    <span className="align-middle">About</span>
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
          {/* Sidebar End */}

          {/* Content Start */}
          <Col xl="8" xxl="9">
            <Tab.Content>
              <Tab.Pane eventKey="overview">
                {/* Overview Tab Start */}

                {/* Stats Start */}
                <h2 className="small-title">Stats</h2>
                <Row className="g-2 mb-5">
                  <Col sm="6" lg="6">
                    <Card className="hover-border-primary">
                      <Card.Body>
                        <div className="heading mb-0 d-flex justify-content-between lh-1-25 mb-3">
                          <span>Operations Tracker</span>
                          <CsLineIcons icon="arrow-end-bottom" className="text-primary" />
                        </div>
                        <div className="text-small text-muted mb-1">Number of uploaded files:</div>
                        <div className="cta-1 text-primary">{list.length}</div>
                      </Card.Body>
                    </Card>
                  </Col>

                </Row>
                {/* Stats End */}
                 
                {/* Logs Start */}
                <h2 className="small-title">Logs</h2>
                <Card>
                  <Card.Body className="mb-n2">
                    <Row className="g-0 mb-2">
                      <Col xs="auto">
                      <ul> { list }</ul>  

                      </Col>
                      <Col xs="auto">
                        
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                {/* Logs End */}

                {/* Overview Tab End */}
              </Tab.Pane>
              <Tab.Pane eventKey="projects">
                {/* Projects Tab Start */}
                <h2 className="small-title">Projects</h2>
                {/* Search Start */}
                <Row className="mb-3 g-2">
                  <Col className="mb-1">
                    <div className="d-inline-block float-md-start me-1 mb-1 search-input-container w-100 shadow bg-foreground">
                      
                      <span className="search-delete-icon d-none">
                        <CsLineIcons icon="close" />
                      </span>
                    </div>
                  </Col>
                 
                </Row>
                {/* Search End */}

                {/* Projects Content Start */}
                <Row className="row-cols-1 row-cols-sm-2 g-2">
                  <Col>
                    <Card className="h-100">
                      <Card.Body>
                        <NavLink to="#" className="stretched-link heading sh-5 d-inline-block h5">
                          <Clamp tag="span" clamp="2">
                            Basic Introduction to Bread Making
                          </Clamp>
                        </NavLink>
                        <div className="mb-2">
                          <CsLineIcons icon="diagram-2" className="text-muted me-2" size="17" />
                          <span className="align-middle text-alternate">Contributors: 4</span>
                        </div>
                        <div className="mb-2">
                          <CsLineIcons icon="trend-up" className="text-muted me-2" size="17" />
                          <span className="align-middle text-alternate">Active</span>
                        </div>
                        <div>
                          <CsLineIcons icon="check-square" className="text-muted me-2" size="17" />
                          <span className="align-middle text-alternate">Completed</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                {/* Projects Content End */}
              
           
              </Tab.Pane>
              <Tab.Pane eventKey="about">
                {/* About Start */}
                <h2 className="small-title">About</h2>
                <Card>
                  <Card.Body>
                    <div className="mb-5">
                      <p className="text-small text-muted mb-2">BIO</p>
                      <p>{UserService.getProfileData()?.bio}</p>
                    </div>
                    <div className="mb-5">
                      <p className="text-small text-muted mb-2">CONTACT</p>
                      <NavLink to="#" className="d-block body-link mb-1">
                        <CsLineIcons icon="home" className="me-2" size="17" />
                        <span className="align-middle">{UserService.getProfileData()?.company}</span>
                      </NavLink>
                      <NavLink to="#" className="d-block body-link mb-1">
                        <CsLineIcons icon="pin" className="me-2" size="17" />
                        <span className="align-middle">{UserService.getProfileData()?.location}</span>
                      </NavLink>
                      <NavLink to="#" className="d-block body-link mb-1">
                        <CsLineIcons icon="phone" className="me-2" size="17" />
                        <span className="align-middle">{UserService.getProfileData()?.contact}</span>
                      </NavLink>
                      <a href={"https://www.linkedin.com/"+ userurl} className="d-block body-link mb-1">
                        <CsLineIcons icon="linkedin" className="me-2" size="17" />
                        <span className="align-middle">https://www.linkedin.com/{UserService.getProfileData()?.linkedin}</span>
                      </a>
                      <NavLink to="#" className="d-block body-link mb-1">
                        <CsLineIcons icon="email" className="me-2" size="17" />
                        <span className="align-middle">{authService.getCurrentUser()?.email}</span>
                      </NavLink>
                    </div>
                  </Card.Body>
                </Card>
                {/* About End */}
              </Tab.Pane>
            </Tab.Content>
          </Col>
          {/* Content End */}
        </Tab.Container>
      </Row>
    </>
  );
}
};

export default ProfileStandard;
