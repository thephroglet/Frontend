import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Card, Nav, Tab, Dropdown, Badge } from 'react-bootstrap';
import { CircularProgressbar } from 'react-circular-progressbar';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import { LAYOUT } from 'constants.js';
import HtmlHead from 'components/html-head/HtmlHead';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import useCustomLayout from 'hooks/useCustomLayout';
import { useWindowSize } from 'hooks/useWindowSize';
import authService from 'services/authService';
import AvatarComponent from './components/AvatarComponent';
import { blogService, fileService, supportService } from 'services';
import { getImage } from 'services/Images';
import { friendService } from 'services';
import ReportUserComp from 'components/ReportComponent/ReportUserComp';
import ReportUserList from 'components/ReportComponent/ReportUserList';
import UserService from 'services/UserService';

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

const PublicUserProfile = (props) => {
  const description = 'Profile';

  const [profile, setProfile] = useState({});
  const [file, setFile] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [recievedRequests, setRecievedRequests] = useState([]);
  const [friend, setFriend] = useState({});
  const [closeButtonOutExample, setCloseButtonOutExample] = useState(false);
  const [blog, setBlog] = useState([]);
  const [support, setSupport] = useState([]);
  const [comments, setComments] = useState([]);
  const [votes, setVotes] = useState([]);

  const title = profile.fname + ' ' + profile.lname;

  const profileId = props.match.params.id;

  const getPostsByUserId = (profile) => {
    blogService.getByUserId(profile.idUser).then((response) => {
      setBlog(response.data);
      console.table("BLOG", response.data)
    });
  };

  const getSupportHelpByUserId = (profile) => {
    supportService.getByUserId(profile.idUser).then((response) => {
      setSupport(response.data);
    });
  };

  const acceptFriendRequest = (friendRequest) => {
    return friendService.AcceptFriendRequest(friendRequest).then(() => {
      loadReceivedFriendRequest();
      loadMyFriendsList(profile);
      loadFriendRequest(profile);
    });
  };

  const blockFriendRequest = (friend) => {
    return friendService
      .BlockFriendRequest({
        firstUser: friend.firstUser,
        secondUser: friend.secondUser,
      })
      .then(() => {
        loadMyFriendsList(profile);
      });
  };

  const cancelFriendRequest = (friendRequest) => {
    return friendService.CancelFriendFromList(friendRequest).then(() => {
      loadSentFriendRequests();
      loadReceivedFriendRequest();
      loadFriendRequest(profile);
    });
  };

  const unfriend = (friendRequest) => {
    console.log('unfriend', { friendRequest });

    return friendService.Unfriend(friendRequest).then(() => {
      loadMyFriendsList(profile);
      loadFriendRequest(profile);
    });
  };

  const createFriendRequest = () => {
    return friendService
      .post({
        firstUser: authService.getCurrentUser().id,
        secondUser: profile.idUser,
      })
      .then(() => {
        loadSentFriendRequests();
        loadFriendRequest(profile)
      });
  };

  const getFilesByUserId = (profile) => {
    console.log(profile.idUser);
    fileService.getByUserId(profile.idUser).then((response) => {
      setFile(response.data);
    });
  };

  const getCommentsByUserId = (profile) => {
    console.log(profile.idUser);
    blogService.getCommentsByUserId(profile.idUser).then((response) => {
      setComments(response.data);
      console.table("comments", response.data)
    });
  };

  const getVotesByUserId = (profile) => {
    console.log(profile.idUser);
    blogService.getVotesByUserId(profile.idUser).then((response) => {
      setVotes(response.data);
    });
  };

  const loadFriends = (profile) => {
    loadMyFriendsList(profile);
    loadSentFriendRequests();
    loadReceivedFriendRequest();
    loadFriendRequest(profile);
  };

  const loadMyFriendsList = (profile) => {
    friendService.getMyFriendsList(profile.idUser).then((response) => {
      setFriends(response.data);
      console.table("Friends List", response.data)
    });
  };

  const isUserFriend = () => {
    return friendService.isUserFriend({
      params:{
        firstUser: authService.getCurrentUser().id,
        secondUser: profile.idUser,
      }}
    )
  }

  const loadSentFriendRequests = () => {
    friendService.getSentFriendRequests().then((response) => {
      setSentRequests(response.data);
    });
  };

  const loadReceivedFriendRequest = () => {
    friendService.getReceivedFriendRequests().then((response) => {
      setRecievedRequests(response.data);
      console.log('recieved requests');
      console.table(response.data);
    });
  };

  const loadFriendRequest = (profile) => {
    const friend = {
      secondUser: authService.getCurrentUser().id,
      firstUser: profile.idUser,
    };
    return friendService
      .getFriendRequest(friend.firstUser, friend.secondUser)
      .then((response) => {
        setFriend(response.data);
        console.table(response.data);
      })
      .catch(() => {
        setFriend(friend);
      });
  };

  const onFileClick = (id) => {
    props.history.push('/analysis/' + id);
  };

  const onSupportClick = (id) => {
    props.history.push('/support/question/' + id);
  };

  useEffect(() => {
    UserService.getProfileById(profileId).then((response) => {
      setProfile(response.data);
      getFilesByUserId(response.data);
      getPostsByUserId(response.data);
      getCommentsByUserId(response.data);
      getVotesByUserId(response.data);
      getSupportHelpByUserId(response.data);
      //  setInterval(() => {
      loadFriends(response.data);
      //   }, 10000)
    });
  }, []);

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'blog', text: 'Blog' },
    { to: 'support', text: 'Support' },
  ];

  let friendscount;
  let editbutton;
  const userconnected = authService.getCurrentUser();
  let avatar;
  let aboutme;
  let interest;
  let linkedin;
  let contact;
  let altmail;
  let company;
  let location;
  let addbutton;
  let messagebutton;
  let reportbutton;
  const ifME = [];
  const friendsList = [];
  const MyFriendRequests = [];
  let rejectbutton;
  let blockbutton;
  let acceptbutton;
  const sentFriendRequests = [];
  let block;


  recievedRequests.forEach((recievedrequest) => {
    const recievedFrinedProfile = recievedrequest.firstProfile != null ? recievedrequest.firstProfile : recievedrequest.secondProfile;
    const user = authService.getCurrentUser();
    acceptbutton = (
      <Button
        onClick={() => acceptFriendRequest(recievedrequest)}
        variant="outline-primary"
        size="sm"
        className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1"
      >
        <CsLineIcons icon="check" />
      </Button>
    );
    rejectbutton = (
      <Button
        onClick={() => cancelFriendRequest(recievedrequest)}
        variant="outline-primary"
        size="sm"
        className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1"
      >
        <CsLineIcons icon="close" />
      </Button>
    );
    
    MyFriendRequests.push(
      <Col>
        <Card>
          <Card.Body>
            <Row className="g-0 sh-6" key={recievedFrinedProfile.id}>
              <Col xs="auto">
                <img src={'/img/profile/' + getImage(recievedFrinedProfile?.avatar)} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
              </Col>
              <Col>
                <div className="d-flex flex-row ps-4 h-100 align-items-center justify-content-between">
                  <div className="d-flex flex-column">
                    <NavLink to={'/profile/' + recievedFrinedProfile.id}>
                      <div>{recievedFrinedProfile.fname + ' ' + recievedFrinedProfile.lname} </div>
                    </NavLink>
                    <div className="text-small text-muted">Joined at {recievedrequest.firstUjoin}</div>
                  </div>
                  <div className="d-flex">
                    {acceptbutton}
                    {rejectbutton}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    );
  });

  sentRequests.forEach((sentRequest) => {
    const sentrequestprofile = sentRequest.firstProfile != null ? sentRequest.firstProfile : sentRequest.secondProfile;
    rejectbutton = (
      <Button
        onClick={() => cancelFriendRequest(sentRequest)}
        variant="outline-primary"
        size="sm"
        className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1"
      >
        <CsLineIcons icon="close" />
      </Button>
    );
    sentFriendRequests.push(
      <Col>
        <Card>
          <Card.Body>
            <Row className="g-0 sh-6" key={sentrequestprofile.id}>
              <Col xs="auto">
                <img src={'/img/profile/' + getImage(sentrequestprofile?.avatar)} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
              </Col>
              <Col>
                <div className="d-flex flex-row ps-4 h-100 align-items-center justify-content-between">
                  <div className="d-flex flex-column">
                    <NavLink to={'/profile/' + sentrequestprofile.id}>
                      <div>{sentrequestprofile.fname + ' ' + sentrequestprofile.lname} </div>
                    </NavLink>
                    <div className="text-small text-muted">Joined at {sentRequest.secondUjoin}</div>
                  </div>
                  <div className="d-flex">{rejectbutton}</div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    );
  });
  let join;

  friends.forEach((friend) => {
    const friendprofile = friend.firstProfile != null ? friend.firstProfile : friend.secondProfile;
   if(profile.idUser == userconnected.id) {
      rejectbutton = (
        <Button onClick={() => unfriend(friend)} variant="outline-primary" size="sm" className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1">
          <CsLineIcons icon="close" />
        </Button>
      );
      block = (
        <Button onClick={() => blockFriendRequest(friend)} variant="outline-primary" size="sm" className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1">
          <CsLineIcons icon="slash" />
        </Button>
      );
      if(userconnected.id == friend.firstUser ){
        join = ( <div className="text-small text-muted">Joined at {friend.secondUjoin}</div>)
      }
      else{
        join = ( <div className="text-small text-muted">Joined at {friend.firstUjoin}</div>)
      }
    } else if(friend.firstUser == userconnected.id || friend.secondUser == userconnected.id) {
    rejectbutton = null;
    block = null;
  }

    console.log("test joined", join)
    friendsList.push(
      <Col>
        <Card>
          <Card.Body>
            <Row className="g-0 sh-6" key={friendprofile.id}>
              <Col xs="auto">
                <img src={'/img/profile/' + getImage(friendprofile?.avatar)} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
              </Col>
              <Col>
                <div className="d-flex flex-row ps-4 h-100 align-items-center justify-content-between">
                  <div className="d-flex flex-column">
                    <NavLink to={'/profile/' + friendprofile.id}>
                      <div>{friendprofile.fname + ' ' + friendprofile.lname} </div>
                    </NavLink>
                   {join}
                  </div>
                  <div className="d-flex">
                    {rejectbutton}
                    {block}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    );
  });
  const list = [];
  let FileStats = null;
  let FileStats1 = null;
  let FileStats2 = null;
  file.forEach((index) => {
    list.push(
      <Col xs="12" sm="4" key={index.id}>
        <Card className="hover-img-scale-up hover-reveal " onClick={() => onFileClick(index.id)}>
          <img src="/img/product/small/chart3.png" className="card-img h-100 scale" alt="card image" />
          <div className="card-img-overlay d-flex flex-column justify-content-between reveal-content">
            <Row className="g-0">
              <Col xs="auto" className="pe-3">
                <NavLink to={'/analysis/' + index.id}>
                  <CsLineIcons icon="file-chart" className="text-white me-1" size="20" />
                  <span className="align-middle text-white">{index.file}</span>{' '}
                </NavLink>
              </Col>
              <Col xs="auto" className="pe-3">
                <CsLineIcons icon="calendar" className="text-white me-1" size="15" />
                <span className="align-middle text-white">{index.uploadedAt}</span>
              </Col>
            </Row>
          </div>
        </Card>
      </Col>
    );
  });
  if(file && file.length <= 10) {
  FileStats = (
    <section className="scroll-section" id="progress">
    <div className="mb-5">
    <Row className="g-2">
    <Col xs="auto">
      <Card className="sw-19 sh-25">
        <Card.Body>
          <div className="h-100 d-flex flex-column justify-content-between align-items-center">
            <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
              <CircularProgressbar value={file.length} strokeWidth={3} text="" className="w-100 h-100 primary text-small" />
              <div className="position-absolute absolute-center text-alternate text-small ">{file.length}/10</div>
            </div>
            <CsLineIcons  className="mt-1" icon="file-empty"/>
                <div className="heading text-center text-small mb-0 d-flex align-items-center">FILES</div>
          </div>
        </Card.Body>
      </Card>
    </Col>
      </Row>
    </div>
  </section>
  )} else {
    FileStats = (
      <section className="scroll-section" id="progress">
      <div className="mb-5">
      <Row className="g-2">
      <Col xs="auto">
        <Card className="sw-19 sh-25">
          <Card.Body>
            <div className="h-100 d-flex flex-column justify-content-between align-items-center">
              <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
                <CircularProgressbar value={100} strokeWidth={3} text=" " className="w-100 h-100 primary" />
                <div className="position-absolute absolute-center text-alternate text-small ">10/10</div>
              </div>
              <div className="heading text-center text-small mb-0 d-flex align-items-center">FILES</div>
              <CsLineIcons  className="mt-1" icon="crown"/>
                  <div className="heading text-center text-small mb-0 d-flex align-items-center">Hustler Rank</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
        </Row>
      </div>
    </section>
  )}
  if(file && file.length > 10 && file.length <= 50) {
  FileStats1 = (
    <section className="scroll-section" id="progress">
    <div className="mb-5">
    <Row className="g-2">
    <Col xs="auto">
      <Card className="sw-19 sh-25">
        <Card.Body>
          <div className="h-100 d-flex flex-column justify-content-between align-items-center">
            <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
              <CircularProgressbar value={100} strokeWidth={3} text="" className="w-100 h-100 primary text-small" />
              <div className="position-absolute absolute-center text-alternate text-small ">50/50</div>
            </div>
            <div className="heading text-center text-small mb-0 d-flex align-items-center">FILES</div>
              <CsLineIcons  className="mt-1" icon="crown"/>
                  <div className="heading text-center text-small mb-0 d-flex align-items-center">Champ Rank</div>
            </div>
        </Card.Body>
      </Card>
    </Col>
      </Row>
    </div>
  </section>
  )}else if(file.length == 50) {
    FileStats1 = (
      <section className="scroll-section" id="progress">
      <div className="mb-5">
      <Row className="g-2">
      <Col xs="auto">
        <Card className="sw-19 sh-25">
          <Card.Body>
            <div className="h-100 d-flex flex-column justify-content-between align-items-center">
              <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
                <CircularProgressbar value={100} strokeWidth={3} text=" " className="w-100 h-100 primary" />
                <div className="position-absolute absolute-center text-alternate text-small ">50/50</div>
              </div>
              <div className="heading text-center text-small mb-0 d-flex align-items-center">FILES</div>
              <CsLineIcons  className="mt-1" icon="crown"/>
                  <div className="heading text-center text-small mb-0 d-flex align-items-center">Champ Rank</div>
            </div>
          </Card.Body>
        </Card>
      </Col>
        </Row>
      </div>
    </section>
  )}
  if(file.length > 50 && file.length <= 500) {
    FileStats2 = (
      <section className="scroll-section" id="progress">
      <div className="mb-5">
      <Row className="g-2">
      <Col xs="auto">
        <Card className="sw-19 sh-25">
          <Card.Body>
            <div className="h-100 d-flex flex-column justify-content-between align-items-center">
              <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
                <CircularProgressbar value={17} strokeWidth={3} text="" className="w-100 h-100 primary text-small" />
                <div className="position-absolute absolute-center text-alternate text-small ">62/500</div>
              </div>
              <CsLineIcons  className="mt-1" icon="file-empty"/>
                <div className="heading text-center text-small mb-0 d-flex align-items-center">FILES</div>
                 </div>
          </Card.Body>
        </Card>
      </Col>
        </Row>
      </div>
    </section>
    )}else if(file.length == 500){
      FileStats2 = (
        <section className="scroll-section" id="progress">
        <div className="mb-5">
        <Row className="g-2">
        <Col xs="auto">
          <Card className="sw-19 sh-25">
            <Card.Body>
              <div className="h-100 d-flex flex-column justify-content-between align-items-center">
                <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
                  <CircularProgressbar value={100} strokeWidth={50} text=" " className="w-100 h-100 primary" />
                  <div className="position-absolute absolute-center text-alternate text-small ">500/500</div>
                </div>
                <div className="heading text-center text-small mb-0 d-flex align-items-center">FILES</div>
                <CsLineIcons  className="mt-1" icon="crown"/>
                    <div className="heading text-center text-small mb-0 d-flex align-items-center">Legend Rank</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
          </Row>
        </div>
      </section>
    )}

    let PostCount = null;
    if(blog && blog.length != 0) {
      PostCount = (
        <section className="scroll-section" id="progress">
        <div className="mb-5">
        <Row className="g-2">
        <Col xs="auto">
          <Card className="sw-19 sh-25">
            <Card.Body>
              <div className="h-100 d-flex flex-column justify-content-between align-items-center">
                <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
                  <CircularProgressbar value={21} strokeWidth={3} text="" className="w-100 h-100 primary text-small" />
                  <div className="position-absolute absolute-center text-alternate text-small ">21</div>
                </div>
                <CsLineIcons  className="mt-1" icon="content"/>
                <div className="heading text-center text-small mb-0 d-flex align-items-center">POSTS</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
          </Row>
        </div>
      </section>
      )}

      let CommentStat = null;
      CommentStat = (
        <section className="scroll-section" id="progress">
        <div className="mb-5">
        <Row className="g-2">
        <Col xs="auto">
          <Card className="sw-19 sh-25">
            <Card.Body>
              <div className="h-100 d-flex flex-column justify-content-between align-items-center">
                <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
                  <CircularProgressbar value={63} strokeWidth={3} text="" className="w-100 h-100 primary text-small" />
                  <div className="position-absolute absolute-center text-alternate text-small ">63</div>
                </div>
                <CsLineIcons  className="mt-1" icon="message"/>
                <div className="heading text-center mb-0 d-flex text-small align-items-center">COMMENTS</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
          </Row>
        </div>
      </section>
      )
      let votesStats = null;
      votesStats = (
        <section className="scroll-section" id="progress">
        <div className="mb-5">
        <Row className="g-2">
        <Col xs="auto">
          <Card className="sw-19 sh-25">
            <Card.Body>
              <div className="h-100 d-flex flex-column justify-content-between align-items-center">
                <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
                  <CircularProgressbar value={78.2} strokeWidth={3} text="" className="w-100 h-100 primary text-small" />
                  <div className="position-absolute absolute-center text-alternate text-small ">782</div>
                </div>
                <span>
                <CsLineIcons className="mt-1" icon="like"/> 
                <CsLineIcons className="mt-1" icon="unlike"/>
                </span>
                <div className="heading text-center mb-0 d-flex text-small align-items-center">VOTES</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
          </Row>
        </div>
      </section>
      )
      friendscount = (
        <section className="scroll-section" id="progress">
        <div className="mb-5">
        <Row className="g-2">
        <Col xs="auto">
          <Card className="sw-19 sh-25">
            <Card.Body>
              <div className="h-100 d-flex flex-column justify-content-between align-items-center">
                <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
                  <CircularProgressbar value={friends.length} strokeWidth={3} text="" className="w-100 h-100 primary text-small" />
                  <div className="position-absolute absolute-center text-alternate text-small ">{friends.length}</div>
                </div>
                <CsLineIcons className="mt-1" icon="user"/> 
                <div className="heading text-center mb-0 d-flex text-small align-items-center">FRIENDS</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
          </Row>
        </div>
      </section>
      )
      

  const activityList = [];
  let status = null;
  blog.forEach((index) => {
    if (index.post.locked == false) {
      if (index.post.edited == true) {
        status = <Badge bg="primary">edited</Badge>;
      } else if (index.post.edited == false) {
        status = null;
      }
      const content = index.post.content;
      const sneakpeek = content.slice(0, 9);
      const jdate = new Date(index.post.postedAt);
      const date = jdate.toLocaleDateString();
      const time = jdate.toLocaleTimeString().slice(0, 4);
      const comms = index.post.comments;
      let total = comms.reduce((acc, comm) => acc + comm.votes, 0);
      let vote = <CsLineIcons icon={total >= 0 ? 'like' : 'unlike'} size="18" />;
    
      activityList.push(
        <Card className="mb-5">
          <Row className="g-0 sh-lg-10 h-auto p-card pt-lg-0 pb-lg-0">
            <Col lg="4" className="d-flex align-items-center">
              <p className="mb-0 pe-0 pr-lg-4">{sneakpeek}...</p>
            </Col>
            <Col lg="3" className="d-flex align-items-center">
              <p className="mb-0 text-alternate">
                {date} {time}
              </p>
            </Col>
            <Col lg="2" className="d-flex align-items-center mb-1 mb-lg-0">
              <p className="mb-0 text-alternate">{status}</p>
            </Col>
            <Col lg="2" className="d-flex align-items-center mb-3 mb-lg-0">
              <NavLink to={'/blog/post/' + index.post.id}>
                <CsLineIcons icon="message" size="18" className="text-primary me-1" />
                <span>{index.post.comments.length}</span>
              </NavLink>
            </Col>
            <Col lg="1" className="d-flex align-items-center justify-content-left justify-content-lg-end">
              <NavLink to={'/blog/post/' + index.post.id}>
                {vote}
                <span className="small-text"> ({total})</span>
              </NavLink>
            </Col>
          </Row>
        </Card>
      );
    }
  });

  const supportList = [];
  let statusq = null;
  support.forEach((index) => {
    if (index.question.status == 'OPEN') {
      statusq = (
        <Badge bg="success" className="me-1">
          OPEN
        </Badge>
      );
    }
    if (index.question.status == 'CLOSED') {
      statusq = (
        <Badge bg="danger" className="me-1">
          CLOSED
        </Badge>
      );
    }
    const contentq = index.question.content;
    const sneakpeeks = contentq.slice(0, 10);
    const jdate = new Date(index.question.createdAt);
    const date = jdate.toLocaleDateString();
    const time = jdate.toLocaleTimeString().slice(0, 4);
    supportList.push(
      <Card className="mb-2" onClick={() => onSupportClick(index.question.id)}>
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
                  <Badge bg="primary" className="me-1">
                    {index.question.category}
                  </Badge>
                  {statusq}
                </Col>
              </Row>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    );
  });

  if (userconnected.id === profile.idUser) {
    editbutton = (
      <Button variant="outline-primary" size="sm" href="/profile/edit" className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1">
        <CsLineIcons icon="edit-square" /> <span>Edit</span>
      </Button>
    );

    
      {/*<div className="sw-12 position-relative mb-3">
        <AvatarComponent />
      </div>*/}

    avatar = ( 
    <img src={'/img/profile/' + getImage(profile?.avatar)} width="100" height="100" className="img-fluid rounded-xl m-1" alt="thumb" />
      
    );
    ifME.push(
      <Nav.Item>
        <Nav.Link eventKey="RecievedFriendRequests">New Requests</Nav.Link>
      </Nav.Item>
    );
    ifME.push(
      <Nav.Item>
        <Nav.Link eventKey="SentFriendRequests">Sent Requests</Nav.Link>
      </Nav.Item>
    );
    ifME.push(
      <Nav.Item>
        <Nav.Link eventKey="SupportLogs">Support Logs</Nav.Link>
      </Nav.Item>
    );
  } else {
    avatar = <img src={'/img/profile/' + getImage(profile?.avatar)} width="100" height="100" className="img-fluid rounded-xl m-1" alt="thumb" />;
  }
  if (userconnected?.id != profile?.idUser) {
    if(!friend.friendRequestStatus) {
      addbutton = (
        <Button onClick={() => createFriendRequest()} variant="primary" className="w-100 me-2">
          Add Friend
        </Button>
      )
      }else if(friend.friendRequestStatus == "PENDING") {
      addbutton = (
        <Button onClick={() => cancelFriendRequest(friend)} variant="primary" className="w-100 me-2">
          Cancel Friendship
        </Button>
      )
    } else if(friend.friendRequestStatus == "ACCEPTED"){
        addbutton = (
        <Button onClick={() => unfriend(friend)} variant="primary" className="w-100 me-2">
          Unfriend
        </Button>
        )
      } else {
        addbutton = null;
      }
    blockbutton = (
      <Button onClick={() => blockFriendRequest(friend)} variant="outline-primary" size="sm" className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1">
        <CsLineIcons icon="slash" /> <span>Block</span>
      </Button>
    );
    messagebutton = (
      <Button variant="outline-primary" className="w-100 me-2">
        <CsLineIcons icon="message" />
        <span> Contact</span>
      </Button>
    );
    reportbutton = (
      <span>
        <Button
          onClick={() => setCloseButtonOutExample(true)}
          variant="outline-primary"
          size="sm"
          className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1"
        >
          <CsLineIcons icon="flag" /> <span>Report</span>
        </Button>
        <ReportUserComp
          list={Object.values(ReportUserList)}
          type="User"
          targetId={profile.idUser}
          show={closeButtonOutExample}
          onHide={() => setCloseButtonOutExample(false)}
        />
      </span>
    );
  }
  if (profile.bio) {
    aboutme = (
      <div className="mb-5">
        <p className="text-small text-muted mb-2">ABOUT ME</p>
        <p>{profile.bio}</p>
      </div>
    );
  }
  if (profile.interests) {
    interest = (
      <div className="mb-5">
        <p className="text-small text-muted mb-2">INTERESTS</p>
        <p>{profile.interests}</p>
      </div>
    );
  }
  if (profile.linkedin) {
    linkedin = (
      <a href={'https://www.linkedin.com/' + profile.linkedin} className="d-block body-link mb-1">
        <CsLineIcons icon="linkedin" className="me-2" size="17" />
        <span className="align-middle">https://www.linkedin.com/{profile?.linkedin}</span>
      </a>
    );
  }
  if (profile.altmail) {
    altmail = (
      <NavLink to="#" className="d-block body-link mb-1">
        <CsLineIcons icon="email" className="me-2" size="17" />
        <span className="align-middle">{profile?.altmail}</span>
      </NavLink>
    );
  }
  if (profile.contact) {
    contact = (
      <NavLink to="#" className="d-block body-link mb-1">
        <CsLineIcons icon="phone" className="me-2" size="17" />
        <span className="align-middle">{profile?.contact}</span>
      </NavLink>
    );
  }
  if (profile.company) {
    company = (
      <NavLink to="#" className="d-block body-link mb-1">
        <CsLineIcons icon="home" className="me-2" size="17" />
        <span className="align-middle">{profile?.company}</span>
      </NavLink>
    );
  }
  if (profile.location) {
    location = (
      <NavLink to="#" className="d-block body-link mb-1">
        <CsLineIcons icon="pin" className="me-2" size="17" />
        <span className="align-middle">{profile?.location}</span>
      </NavLink>
    );
  }

  let ProfileStat = null;
  if(profile.bio != "" && profile.interests != "" && profile.linkedin != "" && profile.altmail != "" && profile.contact != "" && profile.location != "") {
    ProfileStat = (
      <section className="scroll-section" id="progress">
    <div className="mb-5">
    <Row className="g-2">
    <Col xs="auto">
      <Card className="sw-19 sh-25">
        <Card.Body>
          <div className="h-100 d-flex flex-column justify-content-between align-items-center">
            <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
              <CircularProgressbar value={100} strokeWidth={3} icon="crown" className="w-100 h-100 primary text-small" />
              <div className="position-absolute absolute-center text-alternate text-small "> ALL SETUP</div>
            </div>
            <CsLineIcons  className="mt-1" icon="crown"/>
            <div className="heading text-center text-small mb-0 d-flex align-items-center">PROFILE MASTER</div>
          </div>
        </Card.Body>
      </Card>
    </Col>
      </Row>
    </div>
  </section>
    )
  } else if(profile.bio == "" || profile.interests == "" || profile.linkedin == "" || profile.altmail == "" || profile.contact == "" || profile.location == ""){
    ProfileStat = (
      <section className="scroll-section" id="progress">
    <div className="mb-5">
    <Row className="g-2">
    <Col xs="auto">
      <Card className="sw-19 sh-25">
        <Card.Body>
          <div className="h-100 d-flex flex-column justify-content-between align-items-center">
            <div className="sw-7 sh-7 d-flex justify-content-center align-items-center position-relative">
              <CircularProgressbar value={50} strokeWidth={3} icon="crown" className="w-100 h-100 primary text-small" />
              <div className="position-absolute absolute-center text-alternate text-small ">PROFILE INCOPMPLETE</div>
            </div>
            <CsLineIcons  className="mt-1" icon="edit"/>
            <div className="heading text-center text-small mb-0 d-flex align-items-center">Few things are missing..</div>
          </div>
        </Card.Body>
      </Card>
    </Col>
      </Row>
    </div>
  </section>
    )

  }

  useCustomLayout({ layout: LAYOUT.Boxed });

  return (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title and Top Buttons Start */}
      <div className="page-title-container">
        <Row>
          {/* Title Start */}
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">Profile</h1>
            <BreadcrumbList items={breadcrumbs} />
          </Col>
          {/* Title End */}

          {/* Top Buttons Start */}
          <Col md="5" className="d-flex align-items-start justify-content-end">
            {editbutton}
            {reportbutton}
            {blockbutton}
          </Col>
          {/* Top Buttons End */}
        </Row>
      </div>
      {/* Title and Top Buttons End */}

      <Row className="g-5">
        {/* Sidebar Start */}
        <Col xl="4" xxl="3">
          <h2 className="small-title">Biography</h2>
          <Card>
            <Card.Body className="mb-n5">
              <div className="d-flex align-items-center flex-column mb-5">
                <div className="mb-5 d-flex align-items-center flex-column">
                  <div className="sw-13 position-relative mb-3">{avatar}</div>
                  <div className="h5 mb-0">
                    {profile.fname} {profile.lname}
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-between w-100 w-sm-50 w-xl-100">
                  {addbutton}
                  {messagebutton}
                </div>
              </div>
              {aboutme}
              {interest}
              <div className="mb-5">
                <p className="text-small text-muted mb-2">CONTACT</p>
                {linkedin}
                {altmail}
                {company}
                {location}
                {contact}
              </div>
            </Card.Body>
          </Card>
        </Col>
        {/* Sidebar End */}

        {/* Content Start */}
        <Col xl="8" xxl="9">
          <Tab.Container defaultActiveKey="Overview">
            <Nav variant="tabs" className="nav-tabs-title nav-tabs-line-title" activeKey="Overview" as={ResponsiveNav}>
              <Nav.Item>
                <Nav.Link eventKey="Overview">Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Activity">Activity</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Analysis">Analysis</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Friends">Friends</Nav.Link>
              </Nav.Item>
              {ifME}
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="Overview">
              <Row className="row-cols-1 row-cols-sm-4 row-cols-xxl-2 g-3 mb-2">
                {FileStats}
                {FileStats1}
                {FileStats2}
                {PostCount}
                {CommentStat}
                {votesStats}
                {friendscount}
                {ProfileStat}
                </Row>
              </Tab.Pane>
              <Tab.Pane eventKey="Analysis">
                <Row className="row-cols-1 row-cols-sm-2 row-cols-xxl-2 g-3 mb-2">{list}</Row>
              </Tab.Pane>
              <Tab.Pane eventKey="Activity">{activityList}</Tab.Pane>
              <Tab.Pane eventKey="Friends">
                <Row className="row-cols-1 row-cols-md-2 row-cols-xxl-3 g-3">{friendsList}</Row>
              </Tab.Pane>
              <Tab.Pane eventKey="SentFriendRequests">
                <Row className="row-cols-1 row-cols-md-2 row-cols-xxl-3 g-3">{sentFriendRequests}</Row>
              </Tab.Pane>
              <Tab.Pane eventKey="RecievedFriendRequests">
                <Row className="row-cols-1 row-cols-md-2 row-cols-xxl-3 g-3">{MyFriendRequests}</Row>
              </Tab.Pane>
              <Tab.Pane eventKey="SupportLogs">{supportList}</Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
        {/* Content End */}
      </Row>
    </>
  );
};

export default PublicUserProfile;
