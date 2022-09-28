import React from 'react';

import { Button } from 'react-bootstrap';
import LayoutFullpage from 'layout/LayoutFullpage';
import HtmlHead from 'components/html-head/HtmlHead';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import authService from 'services/authService';

class Confirm extends React.Component {
  constructor(props) {
    super(props);
    this.title = 'Confirm';
    this.description = 'Confirm Page';
    let params = (new URL(document.location)).searchParams;
    this.token = params.get("token");
    this.result = null;
  }
  

  confirmToken(token) {
    authService.confirmToken(token).then(response => {
      this.result = response.data;
    });
  }

  componentDidMount() {
    this.confirmToken(this.token);
  }

  render() {
    const leftSide = (
      <div className="min-h-100 d-flex align-items-center" >
        <div className="w-100 w-lg-100 w-xxl-100">
          <div>
            <div className="mb-5">
            <h1 className="display-1 text-white">Welcome!</h1>
            <h3 className="display-6 text-white">Thank you for confirming your email.</h3>
            </div>
             <div className="mb-5">
              <Button variant="secondary" href="/login" className="btn-icon btn-icon-end mb-1">
                  <span className="text-white">Click here to continue  </span> <CsLineIcons icon="arrow-right" />
                </Button>{' '}
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <>
        <HtmlHead title={this.title} description={this.description} />
        <LayoutFullpage left={leftSide}  />
      </>
    );
  }
}

export default Confirm;
