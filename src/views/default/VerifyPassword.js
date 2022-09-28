import React from 'react';
import { Redirect } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import authService from 'services/authService';
import { useHistory } from 'react-router-dom';


const VerifyPassword = () => {
  const title = 'Verify Password';
  const description = 'Verify Password Page';
  const validationSchema = Yup.object().shape({
    pwd: Yup.string().min(8, 'Must be at least 8 chars!').required('Password is required')
  });

  const initialValues = { pwd: ''};

  const onSubmit = (values) => 
    authService.verifyPassword(values.pwd).then(
      (response) => {
        console.log(response.data);
        history.push('/updatepwd')
      }
  );

  const history = useHistory();


  
  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;
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
          <img className="mb-2" src="/img/profile/logo.png" width="100" height="100"/>
          </NavLink>
        </div>
        <div className="mb-5">
          <h2 className="cta-4 mb-0 text-primary">Please confirm your password to continue</h2>
        </div>
        <div>
          <form id="resetForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 filled">
              <CsLineIcons icon="lock-off" />
              <Form.Control type="password" name="pwd" onChange={handleChange} value={values.pwd} placeholder="Password" />
              {errors.pwd && touched.pwd && <div className="d-block invalid-tooltip">{errors.pwd}</div>}
            </div>
            <Button size="lg" type="submit" >
              Confirm
            </Button>
          </form>
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

export default VerifyPassword;
