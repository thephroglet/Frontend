import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { settingsChangeColor } from 'settings/settingsSlice';
import IconMenuNotifications from './notifications/Notifications';
import SearchModal from './search/SearchModal';


const NavIconMenu = () => {
  const { color } = useSelector((state) => state.settings);
  const dispatch = useDispatch();

  const onLightDarkModeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(settingsChangeColor(color.includes('light') ? color.replace('light', 'dark') : color.replace('dark', 'light')));
  };
  const [showSearchModal, setShowSearchModal] = useState(false);



  return (
    <>
      <ul className="list-unstyled list-inline text-center menu-icons">
        <li className="list-inline-item">
          <a href="#/" id="colorButton" onClick={onLightDarkModeClick}>
            <CsLineIcons icon="light-on" size="18" className="light" />
            <CsLineIcons icon="light-off" size="18" className="dark" />
          </a>
        </li>
        <IconMenuNotifications />
      </ul>
      <SearchModal show={showSearchModal} setShow={setShowSearchModal} />
    </>
  );
};

export default React.memo(NavIconMenu);
