import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Dropdown, Button, Badge } from 'react-bootstrap';
import classNames from 'classnames';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { MENU_PLACEMENT } from 'constants.js';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { layoutShowingNavMenu } from 'layout/layoutSlice';
import { fetchNotifications } from './notificationSlice';
import { friendService } from 'services';
import { now } from '@amcharts/amcharts5/.internal/core/util/Time';
import { ref } from 'yup';

let acceptFriendRequest = null;
let denyFriendRequest = null;

const NotificationsDropdownToggle = React.memo(
  React.forwardRef(({ onClick, expanded = false }, ref) => (
    <a
      ref={ref}
      href="#/"
      className="notification-button"
      data-toggle="dropdown"
      aria-expanded={expanded}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
    >
      <div className="position-relative d-inline-flex">
        <CsLineIcons icon="bell" size="18" />
        <span className="position-absolute notification-dot rounded-xl" />
      </div>
    </a>
  ))
);
const NotificationItem = ({ item }) => {
  console.log("ITEM - ", item);
  const user = item.firstProfile === null ? item.secondProfile : item.firstProfile;
  const jdate = new Date(item.createdAt);
  const nowdate = new Date();
  console.log("time now", nowdate)
  const date = jdate.toLocaleDateString();
  const time = jdate.toLocaleTimeString();
  let refTimezone = null;
  let timeDiff = nowdate.getTime() - jdate.getTime();
  console.log("time diff", timeDiff)
  let countDays = timeDiff / (1000 * 3600 * 24);
  let countHours = countDays * 24;
  let countMinutes = countHours * 60;
  let singleDigitDate = countDays.toString().slice(0, 1);
  let countTime = null

  if(singleDigitDate < 1 && countHours >= 1 ){
    refTimezone= "hours ago"
    countTime= countHours.toString().slice(0, 2);
  } else if (singleDigitDate == 1 && countHours == 0.000) {
    refTimezone = "day ago"
    countTime= countDays.toString().slice(0, 1);
  } else if (countHours < 1){
    refTimezone = "mins ago"
    countTime= countMinutes.toString().slice(0, 2);
  } else if (singleDigitDate > 2) {
    refTimezone = "days ago"
    countTime= countDays.toString().slice(0, 2);
  }

  console.log("count in days", countDays) 
  return (
  <li className="mb-3 mx-2 pb-3 border-bottom border-separator-light d-flex">
    <img src={`/img/profile/${user.avatar}`} className="me-3 sw-4 sh-4 rounded-xl align-self-center" alt="thumb" />
    <div body className="align-self-center">
      <span>
      <small>{ user.fname } { user.lname }  </small> <small className='text-muted'> - {countTime} {refTimezone}</small></span>
     {/**<small>{ date } - { time }</small> */} 
     <div>
      <Badge bg="outline-success" size="sm" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        acceptFriendRequest(item);
      }}>Accept</Badge>
      {' '}
      <Badge siez="sm" bg="outline-danger" onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        denyFriendRequest(item);
      }}>Deny</Badge>
      </div>
    </div>
  </li>
  );
}

const NotificationsDropdownMenu = React.memo(
  React.forwardRef(({ style, className, labeledBy, items }, ref) => {
    return (
      <div ref={ref} style={style} className={classNames('notification-dropdown scroll-out', className)} aria-labelledby={labeledBy}>
        <OverlayScrollbarsComponent
          options={{
            scrollbars: { autoHide: 'leave', autoHideDelay: 600 },
            overflowBehavior: { x: 'hidden', y: 'scroll' },
          }}
          className="scroll"
        >
          <ul className="list-unstyled border-last-none">
            {items.map((item, itemIndex) => (
              <NotificationItem key={`notificationItem.${itemIndex}`} item={item} />
            ))}
          </ul>
        </OverlayScrollbarsComponent>
      </div>
    );
  })
);
NotificationsDropdownMenu.displayName = 'NotificationsDropdownMenu';

const MENU_NAME = 'Notifications';
const Notifications = () => {
  const dispatch = useDispatch();

  const {
    placementStatus: { view: placement },
    behaviourStatus: { behaviourHtmlData },
    attrMobile,
    attrMenuAnimate,
  } = useSelector((state) => state.menu);
  const { color } = useSelector((state) => state.settings);
  const { items } = useSelector((state) => state.notification);
  const { showingNavMenu } = useSelector((state) => state.layout);

  acceptFriendRequest = (item) => {
    friendService.AcceptFriendRequest(item)
      .then(() => {
        dispatch(fetchNotifications());
      });
  }
  
  denyFriendRequest = (item) => {
    friendService.CancelFriendFromList(item)
    .then(() => {
      dispatch(fetchNotifications());
    });
  }

  useEffect(() => {
    dispatch(fetchNotifications());
    return () => {};
    // eslint-disable-next-line
  }, []);

  const onToggle = (status, event) => {
    if (event && event.stopPropagation) event.stopPropagation();
    else if (event && event.originalEvent && event.originalEvent.stopPropagation) event.originalEvent.stopPropagation();
    dispatch(layoutShowingNavMenu(status ? MENU_NAME : ''));
  };

  useEffect(() => {
    dispatch(layoutShowingNavMenu(''));
    // eslint-disable-next-line
  }, [attrMenuAnimate, behaviourHtmlData, attrMobile, color]);

  if (items && items.length > 0) {
    return (
      <Dropdown
        as="li"
        bsPrefix="list-inline-item"
        onToggle={onToggle}
        show={showingNavMenu === MENU_NAME}
        align={placement === MENU_PLACEMENT.Horizontal ? 'end' : 'start'}
      >
        <Dropdown.Toggle as={NotificationsDropdownToggle} />
        <Dropdown.Menu
          as={NotificationsDropdownMenu}
          items={items}
          popperConfig={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: () => {
                    if (placement === MENU_PLACEMENT.Horizontal) {
                      return [0, 7];
                    }
                    if (window.innerWidth < 768) {
                      return [-168, 7];
                    }
                    return [-162, 7];
                  },
                },
              },
            ],
          }}
        />
      </Dropdown>
    );
  }
  return <></>;
};
export default React.memo(Notifications);
