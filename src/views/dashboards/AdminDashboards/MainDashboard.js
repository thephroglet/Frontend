import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Nav, Tab, Dropdown, Badge, Table, Modal } from 'react-bootstrap';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { LAYOUT } from 'constants.js';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import useCustomLayout from 'hooks/useCustomLayout';
import { useWindowSize } from 'hooks/useWindowSize';
import UserService from 'services/UserService';
import { blogService, reportService, supportService } from 'services';
import ConfirmationModal from 'components/ConfirmationModal/ConfirmationModal';
import authService from 'services/authService';

const MoreItemToggle = React.forwardRef(({ onClick, parentClassname }, ref) => (
  <a
    ref={ref}
    className={classNames('btn btn-icon btn-icon-only', {
      'btn-foreground mt-2': parentClassname.indexOf('nav-tabs-title') === -1,
      'btn-background pt-0 bg-transparent pe-0': parentClassname.indexOf('nav-tabs-title') > -1,
    })}
    href="#/"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <CsLineIcons icon="more-horizontal" size="20" />
  </a>
));

MoreItemToggle.displayName = 'MoreItemToggle';
// eslint-disable-next-line no-unused-vars
const ResponsiveNav = React.forwardRef(({ className, children }, ref) => {
  const innerRef = React.createRef();
  const [collapseIndex, setCollapseIndex] = useState(children.length);
  const [childSteps, setChildSteps] = useState([]);
  const { width } = useWindowSize();

  const setSteps = () => {
    const steps = [];
    const currentChildren = innerRef.current.children;
    let totalWidth = 0;
    for (let i = 0; i < currentChildren.length; i += 1) {
      totalWidth += currentChildren[i].clientWidth;
      steps.push(totalWidth);
    }
    setChildSteps(steps);
  };
  const checkCollapseIndex = () => {
    const navWidth = innerRef.current.clientWidth;
    let checkedCollapseIndex = childSteps.filter((x) => x < navWidth).length;
    if (checkedCollapseIndex < children.length) {
      checkedCollapseIndex = childSteps.filter((x) => x < navWidth - 50).length;
    }
    if (checkedCollapseIndex !== collapseIndex) {
      setCollapseIndex(checkedCollapseIndex);
    }
  };

  useEffect(() => {
    setSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (width && childSteps.length > 0) {
      checkCollapseIndex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div ref={innerRef} className={className}>
      {children.slice(0, collapseIndex)}
      {collapseIndex !== children.length && (
        <Dropdown className={classNames('nav-item ms-auto pe-0')}>
          <Dropdown.Toggle as={MoreItemToggle} parentClassname={className} />
          <Dropdown.Menu>{children.slice(collapseIndex, children.length)}</Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
});

const MainDashboard = (props) => {
  const title = 'Admin Dashboard';
  const breadcrumbs = [
    { to: 'admin/dashboard', text: 'Home' },
    { to: 'blog', text: 'Blog' },
    { to: 'support', text: 'Support' },
  ];

  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [support, setSupport] = useState([]);
  const [closeButtonOutExample, setCloseButtonOutExample] = useState(false);
  const [comment, setComment] = useState({});
  const [showLockUser, setShowLockUser] = useState(false)
  const [showUnlockUser, setShowUnlockUser] = useState(false)
  const [lockedUserId, SetLockedUserId] = useState(null)
  const [showCloseReport, setShowCloseReport] = useState(false)
  const [reportId, setReportId] = useState(null)

  const closeReport = () => {
    reportService.closeReport(reportId).then(() => {
        loadReports();
        setShowCloseReport(false)
    })
  }
  
  const AskCloseReport = (id) => {
    setReportId(id)
    setShowCloseReport(true)
  }
  
  const AskLockUser = (id) => { 
    SetLockedUserId(id)
    setShowLockUser(true)
  }

  const AskUnlockUser = (id) => {
    SetLockedUserId(id)
    setShowUnlockUser(true)
  }

  const LockUser = () => {
    UserService.LockUser(lockedUserId).then(() => {
      LoadUsers();
      setShowLockUser(false)
    })
  }

  const UnLockUser = () => {
    UserService.UnLockUser(lockedUserId).then(() => {
      LoadUsers();
      setShowUnlockUser(false)
    })
  }

  const LoadUsers = () => {
    UserService.getUsers().then((response) => {
      setUsers(response.data);
      console.table("USERS", response.data)
    });  
  }
 
  const loadReports = () => {
    reportService.all().then((response) => {
      setReports(response.data);
    });
  }

  const loadSupportTickets = () => {
    supportService.all().then((response) => {
      setSupport(response.data);
    });
  }

  const loadData = () => {
    LoadUsers();
    loadReports();
    loadSupportTickets();
  }

  const onSupportClick = (id) => {
    props.history.push('/support/question/' + id);
  };
  
  const getCommentById = (id) => {
    blogService.getCommentById(id).then((response) => {
      setComment(response.data);
      setCloseButtonOutExample(true);
    })
  }

  useEffect(() => {
    if(authService.getCurrentUser().role === 'ADMIN') {
    loadData();
    }
  }, []);

  const UsersList = [];
  const userIcon = <CsLineIcons icon="user"/>

  users.forEach((index) => {
    let AccountStatus = null;
    let LockUnlockButton = null;
    console.table("IDs", index.profile.idUser)
    console.table("ROLES", index.user.userRole)
    if(index?.profile.idUser === '6331cc6251bcde4cfac10b39' ){
      
      AccountStatus =(
 
      <div>
        <Badge bg="warning" className="text-uppercase"> GOLD </Badge>
        {' '}
        <Badge bg="info" className="text-uppercase"> STAFF </Badge>
        {' '}
        <Badge bg="quaternary" className="text-uppercase"> ✔ verified  </Badge>
        </div>
    )
      LockUnlockButton = <Badge bg="background" className="text-uppercase">
      No Actions
    </Badge>;
    }
    else if(index?.user.userRole === 'ADMIN'){
      AccountStatus =(
        <div>
            <Badge bg="danger" className="text-uppercase"> moderator </Badge>
            {' '}
            <Badge bg="info" className="text-uppercase"> STAFF </Badge>
            {' '}
            <Badge bg="quaternary" className="text-uppercase"> ✔ verified  </Badge>
        </div>
        )
        LockUnlockButton = <Badge bg="background" className="text-uppercase">
        No Actions
      </Badge>;
    }
    else if (index?.user.locked == false) {
      AccountStatus = <Badge bg="success">active</Badge>;
      LockUnlockButton = (
        <Button variant="primary" size="sm" onClick={() => AskLockUser(index.user.id)}>
          Lock
        </Button>
      );
    } else if (index?.user.locked == true) {
      AccountStatus = <Badge bg="danger">locked</Badge>;
      LockUnlockButton = (
        <Button variant="primary" size="sm" onClick={() => AskUnlockUser(index.user.id)}>
          Unlock
        </Button>
      );
    }

    UsersList.push(
      <tr>
        <th scope="row">
        <div className="sw-6 me-3">
          <img src={"/img/profile/"+ index?.profile.avatar} className="img-fluid rounded-xl" alt="thumb"></img>
          </div>
        </th>
        <td>{index?.user.firstName} {index?.user.lastName}</td>
        <td>{index?.user.email}</td>
        {/*<td>{index?.profile?.contact}</td> */}
        <td>{AccountStatus}</td>
        <td>{LockUnlockButton}</td>
      </tr>
    );
  });

  const SupportListTech = [];
  const SupportListClaim = [];
  const SupportListRep = [];
  const SupportListTechArchived = [];
  const SupportListClaimArchived = [];
  const SupportListRepArchived = [];
  const billingOPEN = [];
  const billingCLOSED = [];
  let status = null;
  let category = null;


  support.forEach(index => {
    if (index?.question.status == 'OPEN') {
      status = (
        <Badge bg="success" className="me-1">
          OPEN
        </Badge>
      );
    }
    if (index?.question.status == 'CLOSED') {
      status = (
        <Badge bg="danger" className="me-1">
          CLOSED
        </Badge>
      );
    }
    category = (
      <Badge bg="primary" className="me-1">
        {index?.question.category}
      </Badge>
    );
    const content = index.question.content;
    const sneakpeeks = content.slice(0, 10);
    const jdate = new Date(index?.question.createdAt);
    const date = jdate.toLocaleDateString();
    const time = jdate.toLocaleTimeString().slice(0, 5);
    if (index?.question.category == 'TECHNICAL' && index?.question.status == 'OPEN') {
      SupportListTech.push(
        <span>
          {category}
          <tr></tr>
          <Card className="mb-2" onClick={() => onSupportClick(index?.question.id)}>
            <Row className="g-0 sh-14 sh-md-10">
              <Col>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center">
                    <Col md="5" className="d-flex align-items-center mb-2 mb-md-0">
                      <p className="p-0 text-start">{sneakpeeks}...</p>
                    </Col>
                    <Col xs="10" md="6" className="d-flex align-items-center text-medium">
                      <span>
                        {date} {time}
                      </span>
                    </Col>
                    <Col xs="2" md="1" className="d-flex align-items-center justify-content-end">
                      {status}
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </span>
      );
    } else if (index.question.category == 'TECHNICAL' && index.question.status == 'CLOSED') {
      SupportListTechArchived.push(
        <span>
          {category}
          <tr></tr>
          <Card className="mb-2" onClick={() => onSupportClick(index?.question.id)}>
            <Row className="g-0 sh-14 sh-md-10">
              <Col>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center">
                    <Col md="5" className="d-flex align-items-center mb-2 mb-md-0">
                      <p className="p-0 text-start">{sneakpeeks}...</p>
                    </Col>
                    <Col xs="10" md="6" className="d-flex align-items-center text-medium">
                      <span>
                        {date} {time}
                      </span>
                    </Col>
                    <Col xs="2" md="1" className="d-flex align-items-center justify-content-end">
                      {status}
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </span>
      );
    }
    if (index?.question.category == 'CLAIM' && index?.question.status == 'OPEN') {
      SupportListClaim.push(
        <span>
          {category}
          <tr></tr>
          <Card className="mb-2" onClick={() => onSupportClick(index?.question.id)}>
            <Row className="g-0 sh-14 sh-md-10">
              <Col>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center">
                    <Col md="5" className="d-flex align-items-center mb-2 mb-md-0">
                      <p className="p-0 text-start">{sneakpeeks}...</p>
                    </Col>
                    <Col xs="10" md="6" className="d-flex align-items-center text-medium">
                      <span>
                        {date} {time}
                      </span>
                    </Col>
                    <Col xs="2" md="1" className="d-flex align-items-center justify-content-end">
                      {status}
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>{' '}
        </span>
      );
    } else if (index?.question.category == 'CLAIM' && index?.question.status == 'CLOSED') {
      SupportListClaimArchived.push(
        <span>
          {category}
          <tr></tr>
          <Card className="mb-2" onClick={() => onSupportClick(index?.question.id)}>
            <Row className="g-0 sh-14 sh-md-10">
              <Col>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center">
                    <Col md="5" className="d-flex align-items-center mb-2 mb-md-0">
                      <p className="p-0 text-start">{sneakpeeks}...</p>
                    </Col>
                    <Col xs="10" md="6" className="d-flex align-items-center text-medium">
                      <span>
                        {date} {time}
                      </span>
                    </Col>
                    <Col xs="2" md="1" className="d-flex align-items-center justify-content-end">
                      {status}
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>{' '}
        </span>
      );
    }
    if (index?.question.category == 'REPORT' && index?.question.status == 'OPEN') {
      SupportListRep.push(
        <span>
          {category}
          <tr></tr>
          <Card className="mb-2" onClick={() => onSupportClick(index?.question.id)}>
            <Row className="g-0 sh-14 sh-md-10">
              <Col>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center">
                    <Col md="5" className="d-flex align-items-center mb-2 mb-md-0">
                      <p className="p-0 text-start">{sneakpeeks}...</p>
                    </Col>
                    <Col xs="10" md="6" className="d-flex align-items-center text-medium">
                      <span>
                        {date} {time}
                      </span>
                    </Col>
                    <Col xs="2" md="1" className="d-flex align-items-center justify-content-end">
                      {status}
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>{' '}
        </span>
      );
    } else if (index?.question.category == 'REPORT' && index?.question.status == 'CLOSED') {
      SupportListRepArchived.push(
        <span>
          {category}
          <tr></tr>
          <Card className="mb-2" onClick={() => onSupportClick(index?.question.id)}>
            <Row className="g-0 sh-14 sh-md-10">
              <Col>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center">
                    <Col md="5" className="d-flex align-items-center mb-2 mb-md-0">
                      <p className="p-0 text-start">{sneakpeeks}...</p>
                    </Col>
                    <Col xs="10" md="6" className="d-flex align-items-center text-medium">
                      <span>
                        {date} {time}
                      </span>
                    </Col>
                    <Col xs="2" md="1" className="d-flex align-items-center justify-content-end">
                      {status}
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>{' '}
        </span>
      );
    }  if (index?.question.category == 'Billing' && index?.question.status == 'OPEN') {
      billingOPEN.push(
        <span>
          {category}
          <tr></tr>
          <Card className="mb-2" onClick={() => onSupportClick(index?.question.id)}>
            <Row className="g-0 sh-14 sh-md-10">
              <Col>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center">
                    <Col md="5" className="d-flex align-items-center mb-2 mb-md-0">
                      <p className="p-0 text-start">{sneakpeeks}...</p>
                    </Col>
                    <Col xs="10" md="6" className="d-flex align-items-center text-medium">
                      <span>
                        {date} {time}
                      </span>
                    </Col>
                    <Col xs="2" md="1" className="d-flex align-items-center justify-content-end">
                      {status}
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>{' '}
        </span>
      );
    } else if (index?.question.category == 'Billing' && index?.question.status == 'CLOSED') {
      billingCLOSED.push(
        <span>
          {category}
          <tr></tr>
          <Card className="mb-2" onClick={() => onSupportClick(index?.question.id)}>
            <Row className="g-0 sh-14 sh-md-10">
              <Col>
                <Card.Body className="pt-0 pb-0 h-100">
                  <Row className="g-0 h-100 align-content-center">
                    <Col md="5" className="d-flex align-items-center mb-2 mb-md-0">
                      <p className="p-0 text-start">{sneakpeeks}...</p>
                    </Col>
                    <Col xs="10" md="6" className="d-flex align-items-center text-medium">
                      <span>
                        {date} {time}
                      </span>
                    </Col>
                    <Col xs="2" md="1" className="d-flex align-items-center justify-content-end">
                      {status}
                    </Col>
                  </Row>
                </Card.Body>
              </Col>
            </Row>
          </Card>{' '}
        </span>
      );
    }
  });

  const UserReportsList = [];
  const UserReportsListArchived = [];
  const PostReportsList = [];
  const PostReportsListArchived = [];
  const CommReportsList = [];
  const CommReportsListArchived = [];
  let admin = null;

  reports.forEach(report => {
    const jdate = new Date(report.reportedAt);
    const date = jdate.toLocaleDateString();
    const time = jdate.toLocaleTimeString().slice(0, 5);

    if (report.status == 'OPEN') {
      status = (
        <Badge bg="success" className="me-1" onClick={() => AskCloseReport(report.id)}>
          OPEN
        </Badge>
      );
    }
    if (report.status == 'CLOSED') {
      status = (
        <Badge bg="danger" className="me-1">
          CLOSED
        </Badge>);
      admin = (
        <label>closed by{' '} 
          <NavLink to={"/profile/" + report?.adminProfile.id}>
          {report?.adminProfile.fname + " " + report?.adminProfile.lname}
          </NavLink>
        </label>
      );
    }
    category = (
      <Badge bg="primary" className="me-1">
        {report.type}
      </Badge>
    );

    if (report.type == 'User' && report.status == 'OPEN') {
      UserReportsList.push(
        <span>
          {category}
          <Card className="mb-5" body>
            <Row className=" g-0 justify-content-end">
              <Col xs="auto">{status}</Col>
            <Card.Text>
              <NavLink to={'/profile/' + report?.reporterProfile.id}>{report?.reporterProfile.fname + ' ' + report?.reporterProfile.lname}</NavLink> has reported{' '}
              <NavLink to={'/profile/' + report?.reportedProfile.id}>{report?.reportedProfile.fname + ' ' + report?.reportedProfile.lname}</NavLink> for {' '}
              <NavLink to="#">{report?.reason}</NavLink>{' '}
              on {date} at {time}
            </Card.Text>
            </Row>
          </Card>
        </span>
      );
    } else if (report?.type == 'User' && report?.status == 'CLOSED') {
      UserReportsListArchived.push(
        <span>
          {category}
          <Card className="mb-5" body>
            <Row className=" g-0 justify-content-end">
              <Col xs="auto">{status}</Col>
            <Card.Text>
              <NavLink to={'/profile/' + report?.reporterProfile.id}>{report?.reporterProfile.fname + ' ' + report?.reporterProfile.lname}</NavLink> has reported{' '}
              <NavLink to={'/profile/' + report?.reportedProfile.id}>{report?.reportedProfile.fname + ' ' + report?.reportedProfile.lname}</NavLink> for {' '}
              <NavLink to="#">{report?.reason}</NavLink>{' '}
              on {date} at {time}
            </Card.Text>
            <Col xs="auto">{admin}</Col>
            </Row>
            
          </Card>
        </span>
      );
    }
    if (report?.type == 'Post' && report?.status == 'OPEN') {
      PostReportsList.push(
        <span>
          {category}
          <Card className="mb-5" body>
            <Row className=" g-0 justify-content-end">
              <Col xs="auto">{status}</Col>
            <Card.Text>
              <NavLink to={'/profile/' + report?.reporterProfile.id}>{report?.reporterProfile.fname + ' ' + report?.reporterProfile.lname}</NavLink> has reported this{' '}
              <NavLink to={'/blog/post/' + report?.targetId}>CONTENT</NavLink> for{' '}
              <NavLink to="#">{report.reason}</NavLink>{' '}
               on {date} at {time}
            </Card.Text>
            </Row>
          </Card>
        </span>
      );
    } else if (report?.type == 'Post' && report?.status == 'CLOSED') {
      PostReportsListArchived.push(
        <span>
          {category}
          <Card className="mb-5" body>
            <Row className=" g-0 justify-content-end">
              <Col xs="auto">{status}</Col>
            <Card.Text>
              <NavLink to={'/profile/' + report?.reporterProfile.id}>{report?.reporterProfile.fname + ' ' + report?.reporterProfile.lname}</NavLink> has reported this{' '}
              <NavLink to={'/blog/post/' + report?.targetId}>CONTENT</NavLink> for{' '}
              <NavLink to="#">{report?.reason}</NavLink>{' '}
              on {date} at {time}
            </Card.Text>
            <Col xs="auto">{admin}</Col>
            </Row>
          </Card>
        </span>
      );
    }
    if (report?.type == 'Comment' && report?.status == 'OPEN') {
      CommReportsList.push(
        <span>
          {category}
          <Card className="mb-5" body>
            <Row className=" g-0 justify-content-end">
              <Col xs="auto">{status}</Col>
            <Card.Text>
              <NavLink to={'/profile/' + report?.reporterProfile.id}>{report?.reporterProfile.fname + ' ' + report?.reporterProfile.lname}</NavLink> has reported this{' '}
              <NavLink to="#" onClick={() => getCommentById(report?.targetId)}>comment</NavLink> for{' '}
              <NavLink to="#">{report?.reason}</NavLink>{' '}
              on {date} at {time}
            </Card.Text>
            </Row>
          </Card>
        </span>
       
      );
    } else if (report?.type == 'Comment' && report?.status == 'CLOSED') {
      CommReportsListArchived.push(
        <span>
          {category}
          <Card className="mb-5" body>
            <Row className=" g-0 justify-content-end">
              <Col xs="auto">{status}</Col>
            <Card.Text>
              <NavLink to={'/profile/' + report?.reporterProfile.id}>{report?.reporterProfile.fname + ' ' + report?.reporterProfile.lname}</NavLink> has reported this{' '}
              <NavLink to="#" onClick={() => getCommentById(report?.targetId)}>comment</NavLink> for{' '}
              <NavLink to="#">{report?.reason}</NavLink>{' '}
              on {date} at {time}
            </Card.Text>
            <Col xs="auto">{admin}</Col>
            </Row>
          </Card>
        </span>
      );
    }
  });

  useCustomLayout({ layout: LAYOUT.Boxed });
  return (
    <>
      <HtmlHead title={title} />
      {/* Title and Top Buttons Start */}
      <div className="page-title-container">
        <Row>
          {/* Title Start */}
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">{title}</h1>
            <BreadcrumbList items={breadcrumbs} />
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          <Col md="5" className="d-flex align-items-start justify-content-end"></Col>
          {/* Top Buttons End */}
        </Row>
      </div>
      {/* Title and Top Buttons End */}

       {/*LOCK USER */}
      <ConfirmationModal
            show={showLockUser}
            onCancel={() => setShowLockUser(false)}
            onConfirmation={() => LockUser()}
          >
            <p>
              Are you sure you want to lock this user? <th></th>
            </p>
          </ConfirmationModal>

         {/*UnLOCK USER */}
      <ConfirmationModal
            show={showUnlockUser}
            onCancel={() => setShowUnlockUser(false)}
            onConfirmation={() => UnLockUser()}
          >
            <p>
              Are you sure you want to unlock this user? <th></th>
            </p>
          </ConfirmationModal>

           {/*Close Report */}
      <ConfirmationModal
            show={showCloseReport}
            onCancel={() => setShowCloseReport(false)}
            onConfirmation={() => closeReport()}
          >
            <p>
              Are you sure you want to close this report? <th></th>
              This action can not be reverted.
            </p>
          </ConfirmationModal>
         
   
       <Modal className="modal-close-out" show={closeButtonOutExample} onHide={() => setCloseButtonOutExample(false)}>
      <Modal.Body closeButton>
      {comment.commentcontent}
      </Modal.Body>
      </Modal>

      <Row className="g-5">
        <Col xl="8" xxl="9">
          <Tab.Container defaultActiveKey="User">
            <Nav variant="tabs" className="nav-tabs-title nav-tabs-line-title" activeKey="User" as={ResponsiveNav}>
              <Nav.Item>
                <Nav.Link eventKey="User">Users List</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Support">Support Tickets</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="treated">Treated Tickets</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Reports">Reports</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="treatedRep">Treated Reports</Nav.Link>
              </Nav.Item>
            
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="User">
                <section className="scroll-section" id="hoverableRows">
                  <Card body className="mb-5">
                    <h2></h2>
                    <Table hover>
                      <thead>
                        <tr>
                          <th scope="col">{userIcon}</th>
                          <th scope="col">User</th>
                          <th scope="col">Email</th>
                        {/*<th scope="col">Phone Number</th>*/}  
                          <th scope="col">Status</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>{UsersList}</tbody>
                    </Table>
                  </Card>
                </section>
              </Tab.Pane>
              <Tab.Pane eventKey="Support">
                {billingOPEN}
                <div></div>
                {SupportListTech}
                <div></div>
                {SupportListClaim}
                <div></div>
                {SupportListRep}
              </Tab.Pane>
              <Tab.Pane eventKey="treated">
                {billingCLOSED}
                <div></div>
                {SupportListTechArchived}
                <div></div>
                {SupportListClaimArchived}
                <div></div>
                {SupportListRepArchived}
              </Tab.Pane>
              <Tab.Pane eventKey="Reports">
                {UserReportsList}
                <div></div>
                {PostReportsList}
                <div></div>
                {CommReportsList}
                </Tab.Pane>
                <Tab.Pane eventKey="treatedRep">
                {UserReportsListArchived}
                <div></div>
                {PostReportsListArchived}
                <div></div>
                {CommReportsListArchived}
                </Tab.Pane>
              <Tab.Pane eventKey="Friends">
                <Row className="row-cols-1 row-cols-md-2 row-cols-xxl-3 g-3"></Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
        {/* Content End */}
      </Row>
    </>
  );
};

export default MainDashboard;
