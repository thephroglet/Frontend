import React from 'react';
import { Button, NavLink } from 'react-bootstrap';
import CsLineIcons from 'cs-line-icons/CsLineIcons';

import '../../../../components/chatbot/chatbutton.css';


const RedirectButton = () => {
    return (
    <>
    <NavLink href={'/chat'}>
        <div className='fixedButtonChat'>
        <Button size="sm" className="rounded-circle btn-icon ">
            <CsLineIcons icon="message" />
        </Button> 
        </div>
    </NavLink>
    </>
    );
};

export default RedirectButton;
