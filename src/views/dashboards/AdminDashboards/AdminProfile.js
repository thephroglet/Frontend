import React from 'react';
import { NavLink } from 'react-router-dom';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';

const AdminProfile = () => {
  const title = 'Error';

  const rightSide = (
     <div className="min-h-100 d-flex align-items-center" >
        <div className="w-100 w-lg-100 w-xxl-100">
          <div>
            <div className="mb-5">
            <h1 className="display-1 text-white">WHOOPS!</h1>
            <h3 className="display-6 text-white">Admins profiles are not accessible.</h3>
            </div>
             <div className="mb-5">
              <Button variant="secondary" href="/" className="btn-icon btn-icon-end mb-1">
                  <span className="text-white">Click here to return to homepage</span> <CsLineIcons icon="arrow-right" />
                </Button>{' '}
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <>
      <HtmlHead title={title}/>
      <LayoutFullpage right={rightSide} />
    </>
  );
};

export default AdminProfile;
