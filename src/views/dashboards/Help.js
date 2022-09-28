import React from 'react';
import { Button, Row, Col, Card, Form,  } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import authService from 'services/authService';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { claimService } from 'services';
import ClaimCategoryComp from './ClaimCategoryComp';
import ClaimCategory from 'services/ClaimCategory';
import UserService from 'services/UserService';


const Help  = () => {
  const  breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'profile', text: 'Profile' },
    ] 

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('This field is required.')
  });

  const initialValues = { description: UserService.getProfileData()?.description };

  const onSubmit = (values) => {
    
    values.category = values.category !== undefined ? values.category : ClaimCategory.REPORT
    console.log(values)
    claimService.post(values).then (
      (response) => {
        console.log(response.data);
      },
      (error)=> {
        error.toString();
      }
    );
  }

  const onCategoryChange = (category) => {
      values.category = category
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
     

  

                  {/* Public Info Start */}
       <h2 className="small-title">Claim</h2>
          <Card className="mb-5">
            <Card.Body>
              <div>
              <Form onSubmit={handleSubmit} >
               
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                  <Form.Label className="col-form-label">Category</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                        <ClaimCategoryComp onChange={(category) => onCategoryChange(category)} />
                    </Col>
                </Row>
                <Row className="mb-3">
                  <Col lg="2" md="3" sm="4">
                    <Form.Label className="col-form-label">Description</Form.Label>
                  </Col>
                  <Col sm="8" md="9" lg="10">
                    <Form.Control type="textarea" rows={4}  name="description" placeholder="What's the issue?" onChange={handleChange} value={values.description} />
                    {errors.description && touched.description && <div className="d-block invalid-tooltip">{errors.description}</div>}

                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg="2" md="3" sm="4" />
                  <Col sm="8" md="9" lg="10">
                    <Button variant="outline-primary" className="mb-1" type="submit">
                      Send
                    </Button>
                  </Col>
                </Row>
              </Form>
              </div>
            </Card.Body>
          </Card>
     
          
        
    </>
  );
}

export default Help;
