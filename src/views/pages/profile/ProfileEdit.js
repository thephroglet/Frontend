import React from 'react';
import { Button, Row, Col, Card, Form, Tab, FormControl, InputGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from 'services/authService';
import AvatarComponent from './components/AvatarComponent';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import UserService from 'services/UserService';



const ProfileEdit  = (props) => {
  
  const  breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'profile', text: 'Profile' },
    ] 

  const validationSchema = Yup.object().shape({
    fname: Yup.string().required('This field is required.'),
    lname: Yup.string().required('This field is required.'),
    contact: Yup.number(),
  });

  const initialValues = { fname: UserService.getProfileData()?.fname , lname: UserService.getProfileData()?.lname, company : UserService.getProfileData()?.company, location: UserService.getProfileData()?.location, contact: UserService.getProfileData()?.contact, bio: UserService.getProfileData()?.bio, interests: UserService.getProfileData()?.interests, linkedin: UserService.getProfileData()?.linkedin, altmail: UserService.getProfileData()?.altmail };

  
  const onSubmit = (values) => {
    const profile = UserService.getProfileData();
    const EditProfile = Object.assign({}, profile, values)
    console.log(values, profile)
    UserService.profile(EditProfile).then (
      (response) => {
        console.log(response.data);
         const user = authService.getCurrentUser();
        user.firstname = values.fname
        user.lastname = values.lname
        authService.setCurrentUser(user);
        const ProfileData = response.data; 
        UserService.setProfileData(ProfileData);
       // props.history('/profile/'+ profile.id)
      },
      (error)=> {
        error.toString();
      }
    );
  }

  const formik = useFormik({ initialValues, validationSchema ,onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  return (
    
    <>
      <HtmlHead title="Profile"  />
      {/* Title and Top Buttons Start */}
      <div className="page-title-container">
        <Row>
          {/* Title Start */}
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">{authService.getCurrentUser().firstname} {authService.getCurrentUser().lastname}</h1>
            <BreadcrumbList items={breadcrumbs}/>
          </Col>
          {/* Title End */}

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
                    <div className="sw-13 position-relative mb-3">
                    <AvatarComponent />
                    </div>
                    <div className="h5 mb-0"> {authService.getCurrentUser().firstname + " " + authService.getCurrentUser().lastname}</div>
                    <div className="text-muted">
                      <CsLineIcons icon="email" className="me-1" />
                      <span className="align-middle">{authService.getCurrentUser().email}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          {/* Sidebar End */}

          {/* Content Start */}
          <Col xl="8" xxl="9">
          <Row className="g-0 justify-content-end">
            <Col>
            <div className="small-title d-inline-block position-relative">Public Informations</div>
            </Col>
            <Col className="d-flex justify-content-end"> 
            <Button href="/verifypassword" variant="primary" size="sm" className="btn-icon btn-icon">
                <CsLineIcons icon="lock-on" size="10" /> <span className="text-small">UPDATE PASSWORD</span>
              </Button>{' '}</Col>
              </Row>
          <Card className="mb-5">
            <Card.Body>
              <div>
              <Form onSubmit={handleSubmit} >
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">First Name</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="text" name="fname" onChange={handleChange} value={values.fname} />
                    {errors.fname && touched.fname && <div className="d-block invalid-tooltip">{errors.lname}</div>}

                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Last Name</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="text" name="lname" onChange={handleChange} value={values.lname} />
                    {errors.lname && touched.lname && <div className="d-block invalid-tooltip">{errors.lname}</div>}

                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Company</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="text" name="company" onChange={handleChange} value={values.company} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Location</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="text" name="location" onChange={handleChange} value={values.location} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Contact</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="tel" name="contact" onChange={handleChange} value={values.contact} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Linkedin</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon3">https://www.linkedin.com/</InputGroup.Text>
                    <Form.Control name="linkedin" onChange={handleChange} value={values.linkedin} />
               </InputGroup>
                  </Col>
                  </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Primary Em@il</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="email" value={authService.getCurrentUser().email} disabled />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Secondary Em@il</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="email" name="altmail" onChange={handleChange} value={values.altmail} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Biography</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="textarea" rows={4}  name="bio" onChange={handleChange} value={values.bio} />
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Interests</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="textarea" rows={4}  name="interests" onChange={handleChange} value={values.interests} />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg="2" md="3" sm="4" />
                  <Col sm="8" md="9" lg="10">
                    <Button variant="outline-primary" className="mb-1" type="submit">
                      Update
                    </Button>
                  </Col>
                </Row>
              </Form>
              </div>
            </Card.Body>
          </Card>
          {/* Public Info End */}

             
          </Col>
          {/* Content End */}
        </Tab.Container>
      </Row>
    </>
  );
}

export default ProfileEdit;
