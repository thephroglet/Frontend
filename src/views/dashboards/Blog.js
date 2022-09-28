import React from 'react';

import CsLineIcons from 'cs-line-icons/CsLineIcons';
import {Row, Col, Card, NavLink, Button } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import 'intro.js/introjs.css';
import authService from 'services/authService';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import ReportPostCommentList from 'components/ReportComponent/ReportPostCommentList';
import PostFileUpload from 'components/PostComponent/PostFileUpload';
import { blogService } from 'services'
import ReportUserComp from 'components/ReportComponent/ReportUserComp';
import AvatarFilterComponent from 'views/pages/profile/components/AvatarFilterComponent';
import UserService from 'services/UserService';
import ConfirmationModal from 'components/ConfirmationModal/ConfirmationModal';


class Blog extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      breadcrumbs : [
        { to: '', text: 'Home' },
        ],
      posts: [],
      userprofile: null,
      Avatar : UserService.getProfileData() != null && UserService.getProfileData().avatar != undefined ? UserService.getProfileData().avatar : "29.png",    
      reportType: "",
      reportTargetId: "",
      showModal: false,
      showPostDeleteModal : false,
      postToDelete : null,
    }
  }

  DeletePost () {
    blogService.delete(this.state.postToDelete).then(() => {
      this.setState({
        showPostDeleteModal: false
      })
      this.loadPosts();  
    })
   }

  AskDeletePost(postToDelete) {
    this.setState({
      postToDelete,
      showPostDeleteModal: true,
    })
  }
  

  componentDidMount() {
    this.loadPosts()
  }

  loadPosts(){
    blogService.all().then(post => {
      this.setState({
        posts: post.data
      })
      console.log(post.data)

    })
  }


  reportPost(targetId) {
    this.setState({
      reportType:  "Post",
      reportTargetId: targetId,
      showModal: true,
    })
  }

  PostHasImage(post) {
    const fileTypes = ["jpg", "jpeg", "gif", "png"]
    if(post.file != undefined && post.file != null){
      const split = post.file.split(".")
      const extension = split[split.length -1]
      return fileTypes.includes(extension) 
    }
    return false;
  }

  PostHasFile(post) {
      return post.file != undefined && post.file != null
  }


  onClickPost = (id) => {
    this.props.history.push("/blog/post/" + id)
  }

  isAdmin = (id) => {
    return UserService.isUserAdmin(id)
  }
    
    
  title = 'Blog';
  description = 'Blog';

 

  render() {
    const list = []
    let Buttons = null
    let editedpost = null;
    const connected = authService.getCurrentUser()
    let reportbutton = null;
    let addPost = null;

    if(connected.role == "USER"){
      addPost = <PostFileUpload onCreated={() => this.loadPosts()}/>
    } else if (connected.role == "ADMIN"){
      addPost = null;
    }
    

     for( let index in this.state.posts){
      if (this.state.posts[index] === undefined || this.state.posts[index] === null)
        continue
       const post = this.state.posts[index].post;
       const user = this.state.posts[index].userprofile;
       const commentsCount = this.state.posts[index].post.comments.length
       const jdate = new Date(post.postedAt)
        const date = jdate.toLocaleDateString();
        const time = jdate.toLocaleTimeString().slice(0, 5);
        const ampm = jdate.toLocaleTimeString().slice(8, 10);
        let File = null;
     
       if(post && this.PostHasImage(post)){
        File = (
          <div className="mt-5">
            <img src={"/img/bloguploads/"+ post.file} className="sh-25" alt="thumb" />
          </div>
        )
       }
       if(post && this.PostHasImage(post) == false && this.PostHasFile(post) == true){
        File = (
          <NavLink href={`/blog/post/${post.id}`}>
          <h6 className="text-small text-muted"> See attached file</h6>
          </NavLink>
        )
       }
      
       if(post.edited == true) {
        editedpost = "edited"
       }else editedpost = null

        if(connected.id == post.idUser ){
          Buttons = (
            <Row className="g-0 justify-content-end">
            <Col >
            <span> 
            <Button href={`/blog/post/${post.id}`} size="sm" variant="outline-primary" className="btn-icon btn-icon-start btn-icon  w-md-auto ms-1">
                <CsLineIcons icon="edit-square"/>
            </Button>
            <Button onClick={() => this.AskDeletePost(post.id)} size="sm" variant="primary" className="btn-icon btn-icon-start btn-icon  w-md-auto ms-1">
                <CsLineIcons icon="multiply"/>
            </Button> </span>
            </Col>
            </Row>
          )
        }else Buttons = null    
        
        if(connected.id != post.idUser) {
          reportbutton = (
            <Button onClick={() => this.reportPost(post.id)} variant="outline-primary" size="sm" className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1">
            <CsLineIcons icon="flag" />
            </Button>
          )
        }else reportbutton = null 

        if(post.locked == true) {
          if(post.idUser == connected.id || connected.role == "ADMIN"){
            list.push((
              <Card body >
                           <Row className="g-0 justify-content-end">
                           <Col className="sw-7 d-inline-block position-relative me-3" xs="2">
              <AvatarFilterComponent userprofile={user} />
            </Col>
                      <Col className="d-inline-block position-relative sw-25 text-muted line-through">
                        <NavLink href={"/profile/"+ user.id}>
                          {user?.fname + " " + user?.lname}  
                          <span className="text-muted line-through text-small text-right"> {date} {time} {ampm} {editedpost} </span>
                          </NavLink>
                      </Col>
                      </Row>  
              <Card body>
                <h4 className="mb-1 text-muted line-through" onClick={() => this.onClickPost(post.id)}>
                  {post.content}
                </h4>
                {File}
              </Card>
              <Card.Footer className="border-0 pt-0">
                  <Col xs="12">
                    <Row className="g-0 justify-content-end">
                      <Col xs="auto" className="ps-3">
                        <NavLink href={`/blog/post/${post.id}`}>
                          <CsLineIcons icon="message" size="20" className="text-primary me-1" />
                          <span className="align-middle text-muted line-through">Comment ({ commentsCount })</span>
                        </NavLink>
                      </Col>
                    </Row>
                  </Col>
              </Card.Footer>
            </Card>
             ))
           }
          }else {
            
            list.push((
              <Card body >
                           <Row className="g-0 justify-content-end">
                           <Col className="sw-7 d-inline-block position-relative me-3" xs="2">
              <img src={"/img/profile/"+user?.avatar} className="img-fluid rounded-xl" alt="thumb" />
            </Col>
                      <Col className="d-inline-block position-relative sw-25">
                        <NavLink href={"/profile/"+ user.id}>
                          {user?.fname + " " + user?.lname}  
                          <span className="text-muted text-small text-right"> {date} {time} {ampm} {editedpost} </span>
                          </NavLink>
                      </Col>
                      <Col xs="auto" className="ps-3">
                      {Buttons}
                      {reportbutton}
                      </Col>
                      </Row>    
              <Card body>
                <h4 className="mb-1"onClick={() => this.onClickPost(post.id)}>
                  {post.content}
                </h4>
                {File}
              </Card>
              <Card.Footer className="border-0 pt-0">
                  <Col xs="12">
                    <Row className="g-0 justify-content-end">
                      <Col xs="auto" className="ps-3">
                        <NavLink href={`/blog/post/${post.id}`}>
                          <CsLineIcons icon="message" size="20" className="text-primary me-1" />
                          <span className="align-middle">Comment ({ commentsCount })</span>
                        </NavLink>
                      </Col>
                    </Row>
                  </Col>
              </Card.Footer>
            </Card>
             ))
           }
        
        }
     
      

        

    return (
      <>
        <HtmlHead title={this.title} description={this.description} />
        <div className="page-title-container">
        <Row>
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">Blog</h1>
            <BreadcrumbList items={this.state.breadcrumbs} />
          </Col>
        </Row>
      </div>
       
        <div>
          {addPost}
          </div>
              <ul/>              
              <Row className="g-5">
        <Col xl="8" xxl="9" className="mb-5"></Col>
        { list }
         </Row>
         <ReportUserComp list={Object.values(ReportPostCommentList)} type={this.state.reportType} targetId={this.state.reportTargetId} show={this.state.showModal} onHide={() => this.setState({ showModal: false })}/>

          {/* Confirm Post Deletion */}
          <ConfirmationModal
            show={this.state.showPostDeleteModal}
            onCancel={() => this.setState({ showPostDeleteModal: false })}
            onConfirmation={() => this.DeletePost()}
          >
            <p>
              Are you sure you want to delete this post? <th></th>
              This action can not be reverted.
            </p>
          </ConfirmationModal>
      </>

    );
  }
};

export default Blog;
