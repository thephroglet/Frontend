import React , { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Form, Modal, Card } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import authService from 'services/authService';



const Register = () => {
  const title = 'Register';
  const description = 'Register Page';

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().min(8, 'Must be at least 8 chars!').required('Password is required'),
    terms: Yup.bool().required().oneOf([true], 'Terms must be accepted'),
  });
  const initialValues = { firstName: '', lastName: '', email: '', password: '', terms: false };
  const onSubmit = (values) => 
  authService.register(values.firstName,values.lastName,values.email,values.password).then(
    (response) => {
      console.log(response.data);
    },
    (error) =>
    {
      error.toString(); 
    }
  );
  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;
  const [exampleModal, setExampleModal] = useState(false);


  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
          <div className="mb-5">
          <h1 className="display-2 text-white">Insight Platform</h1>
            <h1 className="display-3 text-white">Get Advanced Insights From Your Data</h1>
          </div>
          <p className="h6 text-white lh-1-5 mb-5">
            Dynamically target high-payoff intellectual capital for customized technologies. Objectively integrate emerging core competencies before
            process-centric communities...
          </p>
          <div className="mb-5">
          <Button size="lg" variant="outline-white" href="https://www.datawize.io/">
              About us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const rightSide = (
    <div className="sw-lg-70 min-h-100 bg-foreground d-flex justify-content-center align-items-center shadow-deep py-5 full-page-content-right-border">
      <div className="sw-lg-50 px-5">
        <div className="sh-11">
          <NavLink to="/">
          <img className="mb-5" src="/img/profile/logo.png" width="100" height="100"/>
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-1 mb-0 text-primary">Welcome,</h2>
          <h2 className="cta-1 text-primary">let's get the ball rolling!</h2>
        </div>
        <div className="mb-5">
          <p className="h6">Please use the form to register.</p>
          <p className="h6">
            If you are a member, please <NavLink to="/login">login</NavLink>.
          </p>
        </div>
        <div>
          <form id="registerForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="user" />
              <Form.Control type="text" name="firstName" placeholder="Name" value={values.firstName} onChange={handleChange} />
              {errors.lastName && touched.lastName && <div className="d-block invalid-tooltip">{errors.firstName}</div>}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="user" />
              <Form.Control type="text" name="lastName" placeholder="Family Name" value={values.lastName} onChange={handleChange} />
              {errors.lastName && touched.lastName && <div className="d-block invalid-tooltip">{errors.lastName}</div>}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="email" />
              <Form.Control type="text" name="email" placeholder="Email" value={values.email} onChange={handleChange} />
              {errors.email && touched.email && <div className="d-block invalid-tooltip">{errors.email}</div>}
            </div>
            <div className="mb-3 filled form-group tooltip-end-top">
              <CsLineIcons icon="lock-off" />
              <Form.Control type="password" name="password" onChange={handleChange} value={values.password} placeholder="Password" />
              {errors.password && touched.password && <div className="d-block invalid-tooltip">{errors.password}</div>}
            </div>
            <div className="mb-3 position-relative form-group">
              <div className="form-check">
                <input type="checkbox" className="form-check-input" name="terms" onChange={handleChange} value={values.terms} />
                <label className="form-check-label">
                  I have read and accept the{' '}
                  <NavLink to="/" target="_blank">
                    terms and conditions.
                  </NavLink>
                </label>
                {errors.terms && touched.terms && <div className="d-block invalid-tooltip">{errors.terms}</div>}
              </div>
            </div>
            <Button primary size="lg" type="submit" onClick={() => setExampleModal(true)}>
              Signup
            </Button>
          </form>
          <section className="scroll-section" id="default">
            <Card body className="mb-5">
              <Modal show={exampleModal} onHide={() => setExampleModal(false)}>
                <Modal.Body closeButton> 
                <h2 className="small-title">Thank you {values.firstName} for joining! </h2> 
                  <h2 className="small-title"> Please confirm your account. </h2>  </Modal.Body>
              </Modal>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default Register;
