import React from 'react';

import CsLineIcons from 'cs-line-icons/CsLineIcons';
import {Row, Col, Card, NavLink, Button, Badge} from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import 'intro.js/introjs.css';
import authService from 'services/authService';
import UpdatePostComponent from 'components/PostComponent/UpdatePostComponent';
import { blogService } from 'services'
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import Comment from 'components/PostComponent/Comment';
import UpdateComment from 'components/PostComponent/UpdateComment';
import ConfirmationModal from 'components/ConfirmationModal/ConfirmationModal';
import ReportPostCommentList from 'components/ReportComponent/ReportPostCommentList';
import ReportUserComp from 'components/ReportComponent/ReportUserComp';
import AvatarFilterComponent from '../profile/components/AvatarFilterComponent';
import UserService from 'services/UserService';
import FileViewerComponent from 'components/PostComponent/FileViewerComponent';

class BlogPost extends React.Component {

  constructor(props) {
    super(props)
    this.idPost = this.props.match.params.id;
    this.state = {
      commentcontent : null,
      post: null,
      userprofile: null,
      onEditPost : false,
      onEditComment : false,
      showDeletePostModal: false,
      showDeleteCommentModal: false,
      showDisablePostModal : false,
      breadcrumbs : [
        { to: '', text: 'Home' },
        { to: 'blog', text: 'Blog' },
        ],
      Avatar : UserService.getProfileData() != null && UserService.getProfileData().avatar != undefined ? UserService.getProfileData().avatar : "29.png",
      reportType: "",
      reportTargetId: "",
      showModal: false,
      commentToDelete: null,
    }
  }

   onSubmit(event) {
    event.preventDefault()
    if (!this.commentcontent)
      return
    blogService.addComment({
      commentcontent: this.commentcontent,
      idUser: authService.getCurrentUser().id,
      idPost: this.state.post.id
    }).then(() => {
      this.commentcontent = ""
      this.loadPost();
    });
  }

 DeletePost () {
  blogService.delete(this.state.post).then(() => {
    this.props.history.push('/blog')
  })
 }

 DeleteComment(){
  blogService.deleteComment(this.state.commentToDelete).then(() => {
    this.setState({
      showDeleteCommentModal: false
    })
    this.loadPost()
  }).catch(() => {
    this.setState({
      showDeleteCommentModal: false
    })
  })
 }

 AskDeleteComment(commentToDelete) {
  this.setState({
    commentToDelete,
    showDeleteCommentModal: true,
  })
 }

  onUpvoteClick = (idComment) => {
    const user = authService.getCurrentUser().id
    blogService.upvoteComment(idComment, {
      params : {
        idUser : user.id
      }
    }).then(()=> {
      this.loadPost();
    })
  }

  onDownVoteClick = (idComment) => {
    const user = authService.getCurrentUser().id
    blogService.downvoteComment(idComment, {
      params : {
        idUser : user.id
      }
    }).then(()=> {
      this.loadPost();
    })
  }

  componentDidMount() {
    this.loadPost()
  }

  loadPost(){
    return blogService.get(this.idPost).then(post => {
      this.setState({
        post: post.data.post,
        userprofile: post.data.userprofile
      })
      console.log(post.data)
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

  getFileExtension() {
    if(this.state.post.file){
      const split = this.state.post.file.split(".")
      return split[split.length -1] 
    }
      return false    
}

  reportComment(targetId) {
    this.setState({
      reportType:  "Comment",
      reportTargetId: targetId,
      showModal: true,
    })
  }

  reportPost(targetId) {
    this.setState({
      reportType:  "Post",
      reportTargetId: targetId,
      showModal: true,
    })
  }

  DisableContent() {
    blogService.put("",null, {
      params: {
        id: this.state.post.id
      }
    }).then(() => {
      this.setState({
        showDisablePostModal : false
      })
      this.loadPost();
    })
  }
  
  Reload() {
    this.loadPost().then(() => {
      this.setState({
        onEditPost : false
      })
    })
  }

  title = 'Blog';
  description = 'Blog';

  render() {
    const list = []
    let File = null
    let Post = null
    let PostButtons = null
    let PostContent = null
    let CommentEdit = null 
    let reportpostbutton = null
    let postavatarfilter = null
    let editedpost = null
    const connected = authService.getCurrentUser()

      postavatarfilter = <AvatarFilterComponent userprofile={this.state.userprofile}/>
   
    if(this.state.post && this.state.onEditPost){
      PostContent = <UpdatePostComponent onCreated={() => this.Reload()} id={this.state.post.id} content={this.state.post.content}/>
    }else if (this.state.post) {

      PostContent = (
        <h4 className="mb-3">
        {this.state.post.content}
      </h4>
      )
    }

     if(this.state.post && this.PostHasImage(this.state.post)){
      File = (
        <div className="mt-5">
          <img src={"/img/bloguploads/"+ this.state.post.file} className="sh-25" alt="thumb" />
        </div>
      )
     }
     if(this.state.post && this.getFileExtension() == "pdf"){
      console.log(this.getFileExtension())
      File = (
        <Card className="mb-5">
        <Row className="g-0 sh-10">
          <Col xs="2" lg="1" className="d-flex align-items-center">
            <Card.Img src="/img/icons/pdf.png" alt="card image" className="card-img-horizontal" />
          </Col>
          <Col xs="10" lg="11" className="h-100">
            <Row className="g-0 h-100 align-content-center">
              <Col xs="12" lg="5" className="d-flex align-items-center">
                <p className="mb-0 ps-card">{this.state.post.filename}</p>
              </Col>
              <Col xs="5" lg="4" sm="5" className="d-flex align-items-center mb-1 mb-md-0">
                <a href={"/img/bloguploads/"+ this.state.post.file} download={"download"+this.state.post.filename}>
                <img src="/img/icons/download.png" alt="image" className="sh-5" /> 
               </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    )
     }
     if(this.state.post && this.getFileExtension() == "csv"){
      File = (
        <Card className="mb-5">
        <Row className="g-0 sh-10">
          <Col xs="2" lg="1" className="d-flex align-items-center h-100">
            <Card.Img src="/img/icons/csv.png" alt="card image" className="card-img-horizontal" />
          </Col>
          <Col xs="10" lg="11" className="h-100">
            <Row className="g-0 h-100 align-content-center">
              <Col xs="12" lg="5" className="d-flex align-items-center">
                <p className="mb-0 ps-card">{this.state.post.filename}</p>
              </Col>
              <Col xs="5" lg="4" sm="5" className="d-flex align-items-center mb-1 mb-md-0">
                <a href={"/img/bloguploads/"+ this.state.post.file} download={"download"+this.state.post.filename}>
                <img src="/img/icons/download.png" alt="image" className="sh-5" /> 
               </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    )
     }
     if(this.state.post && this.getFileExtension() == "xlsx"){
        File = (
          <Card className="mb-5">
          <Row className="g-0 sh-10">
            <Col xs="2" lg="1" className="d-flex align-items-center h-100">
              <Card.Img src="/img/icons/xlsx.png" alt="card image" className="card-img-horizontal" />
            </Col>
            <Col xs="10" lg="11" className="h-100">
              <Row className="g-0 h-100 align-content-center">
                <Col xs="12" lg="5" className="d-flex align-items-center">
                  <p className="mb-0 ps-card">{this.state.post.filename}</p>
                </Col>
                <Col xs="5" lg="4" sm="5" className="d-flex align-items-center mb-1 mb-md-0">
                  <a href={"/img/bloguploads/"+ this.state.post.file} download={"download"+this.state.post.filename}>
                  <img src="/img/icons/download.png" alt="image" className="sh-5" /> 
                 </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      )
     }
     if(this.state.post && this.getFileExtension() == "txt"){
          File = (
            <Card className="mb-5">
            <Row className="g-0 sh-10">
              <Col xs="2" lg="1" className="d-flex align-items-center h-100">
                <Card.Img src="/img/icons/txt.png" alt="card image" className="card-img-horizontal" />
              </Col>
              <Col xs="10" lg="11" className="h-100">
                <Row className="g-0 h-100 align-content-center">
                  <Col xs="12" lg="5" className="d-flex align-items-center">
                    <p className="mb-0 ps-card">{this.state.post.filename}</p>
                  </Col>
                  <Col xs="5" lg="4" sm="5" className="d-flex align-items-center mb-1 mb-md-0">
                    <a href={"/img/bloguploads/"+ this.state.post.file} download={"download"+this.state.post.filename}>
                    <img src="/img/icons/download.png" alt="image" className="sh-5" /> 
                   </a>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        )
     }
     if(this.state.post && this.getFileExtension() == "docx"){
      File = (
        <Card className="mb-5">
        <Row className="g-0 sh-10">
          <Col xs="2" lg="1" className="d-flex align-items-center h-100">
            <Card.Img src="/img/icons/docx.png" alt="card image" className="card-img-horizontal" />
          </Col>
          <Col xs="10" lg="11" className="h-100">
            <Row className="g-0 h-100 align-content-center">
              <Col xs="12" lg="5" className="d-flex align-items-center">
                <p className="mb-0 ps-card">{this.state.post.filename}</p>
              </Col>
              <Col xs="5" lg="4" sm="5" className="d-flex align-items-center mb-1 mb-md-0">
                <a href={"/img/bloguploads/"+ this.state.post.file} download={"download"+this.state.post.filename}>
                <img src="/img/icons/download.png" alt="image" className="sh-5" /> 
               </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    )
     }
     if(this.state.post && this.getFileExtension() == "mp3"){
      File = (
        <Card className="mb-5">
        <Row className="g-0 sh-10">
          <Col xs="2" lg="1" className="d-flex align-items-center h-100">
            <Card.Img src="/img/icons/audio.png" alt="card image" className="card-img-horizontal" />
          </Col>
          <Col xs="10" lg="11" className="h-100">
            <Row className="g-0 h-100 align-content-center">
              <Col xs="12" lg="5" className="d-flex align-items-center">
                <p className="mb-0 ps-card">{this.state.post.filename}</p>
              </Col>
              <Col xs="5" lg="4" sm="5" className="d-flex align-items-center mb-1 mb-md-0">
                <a href={"/img/bloguploads/"+ this.state.post.file} download={"download"+this.state.post.filename}>
                <img src="/img/icons/download.png" alt="image" className="sh-5" /> 
               </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    )
     }
     if(this.state.post && (this.getFileExtension() == "mp4" || this.getFileExtension() == "webm")){
      File = (
        <Card className="mb-5">
        <Row className="g-0 sh-10">
          <Col xs="2" lg="1" className="d-flex align-items-center h-100">
            <Card.Img src="/img/icons/video.png" alt="card image" className="card-img-horizontal" />
          </Col>
          <Col xs="10" lg="11" className="h-100">
            <Row className="g-0 h-100 align-content-center">
              <Col xs="12" lg="5" className="d-flex align-items-center">
                <p className="mb-0 ps-card">{this.state.post.filename}</p>
              </Col>
              <Col xs="5" lg="4" sm="5" className="d-flex align-items-center mb-1 mb-md-0">
                <a href={"/img/bloguploads/"+ this.state.post.file} download={"download"+this.state.post.filename}>
                <img src="/img/icons/download.png" alt="image" className="sh-5" /> 
               </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    )
     }

     if (this.state.post) {
      const jdate = new Date(this.state.post.postedAt)
      const date = jdate.toLocaleDateString();
      const time = jdate.toLocaleTimeString().slice(0, 5);
      const ampm = jdate.toLocaleTimeString().slice(8, 11);
      
      let open;
      if(this.state.post.edited == true){
        editedpost = "edited"
      }
      if(this.state.post.locked == false && connected.role == "ADMIN"){
        open = (
           <Button  onClick={() => this.setState({ showDisablePostModal: true })} variant="outline-success" className="mt-1 btn-icon" size="sm">
            <CsLineIcons icon="lock-off"/>
           </Button>
        )
      }
      
      if(connected.id == this.state.userprofile.idUser ){
        PostButtons = (
          
            <span> 
            <Button onClick={() => this.setState({onEditPost : true})} size="sm" variant="outline-primary" className="btn-icon btn-icon-start btn-icon  w-md-auto ms-1">
                <CsLineIcons icon="edit-square"/>
            </Button>
            <Button onClick={() => this.setState({ showDeletePostModal: true })} size="sm" variant="primary" className="btn-icon btn-icon-start btn-icon  w-md-auto ms-1">
                <CsLineIcons icon="multiply"/>
            </Button> </span>
        )
      } else if(connected.id != this.state.userprofile.idUser) {
        PostButtons = null
        reportpostbutton = (
          <Button onClick={() => this.reportPost(this.state.post.id)} variant="outline-primary" size="sm" className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1">
          <CsLineIcons icon="flag" />
          </Button>
        )
      }

    

      if(this.state.post && this.state.post.locked == true) {
        const locked = (
          <Button variant="outline-danger" className="mt-1 btn-icon" size="sm">
            <CsLineIcons icon="lock-on"/>
         </Button>
        )
        Post = (
          <Card body>
            <Row className="g-0 justify-content-end">
            <Col className="sw-8 d-inline-block position-relative p-0" xs="2">
            {postavatarfilter}
                </Col>
                  <Col className="d-inline-block">
                    <NavLink href={"/profile/" + this.state.userprofile.id} >
                      <div className="h5 mb-0 line-through text-muted"> {this.state.userprofile.fname + " " + this.state.userprofile.lname} 
                      <span className="text-muted text-small text-right"> {date} {time} {ampm} {editedpost} </span></div></NavLink>
                  </Col>
                  <Col xs="auto" className="ps-3">
                    {locked}
                  </Col>
                  </Row>      
          <Card body>
         <label className='line-through text-muted'> {PostContent}</label> 
          </Card>
          <Card.Footer className="border-0 pt-0">
              <Col xs="12">
                <Row className="g-0 justify-content-end">
                  <Col xs="auto" className="ps-3">
                      <CsLineIcons icon="message" size="20" className="text-primary me-1" style={{ color : "green"}} />
                      <span className="align-middle text-muted line-through">Comments ({ this.state.post.comments.length })</span>
                  </Col>
                </Row>
              </Col>
          </Card.Footer>
        </Card>
        )
      }

      else if(this.state.post && this.state.post.locked == false) {
        Post = (
        <Card body>
          <Row className="g-0 justify-content-end">
          <Col className="sw-8 d-inline-block position-relative me-3" xs="2">
              <img src={"/img/profile/"+this.state.userprofile.avatar} width="75" className="img-fluid rounded-xl" alt="thumb" />
              </Col>
                <Col className="d-inline-block">
                  <NavLink href={"/profile/" + this.state.userprofile.id} >
                    <div className="h5 mb-0"> {this.state.userprofile.fname + " " + this.state.userprofile.lname} 
                    <span className="text-muted text-small text-right"> {date} {time} {ampm} {editedpost} </span></div></NavLink>
                </Col>
                <Col xs="auto" className="ps-3">
                {open}
                {PostButtons}
                {reportpostbutton}
                </Col>
                </Row>      
        <Card body>
       {PostContent}
          {File}
        </Card>
        <Card.Footer className="border-0 pt-0">
            <Col xs="12">
              <Row className="g-0 justify-content-end">
                <Col xs="auto" className="ps-3">
                    <CsLineIcons icon="message" size="20" className="text-primary me-1" />
                    <span className="align-middle">Comments ({ this.state.post.comments.length })</span>
                </Col>
              </Row>
            </Col>
        </Card.Footer>
      </Card>
      )
     }
    }
     if (this.state.post && this.state.post.locked == false) {
      CommentEdit = <Comment idPost={this.state.post.id} onCommentCreated={() => this.loadPost()} />
      for( let index in this.state.post?.comments){
        const comment = this.state.post?.comments[index];
        const jdate = new Date(comment.commentedAt)
        const date = jdate.toLocaleDateString();
        const time = jdate.toLocaleTimeString().slice(0, 5);
        const ampm = jdate.toLocaleTimeString().slice(8, 10);
        const user = comment.profileUser;
        let CommentButtons = [];
        let editedcomm = null;

        if(this.state.post && this.state.post.locked == true) {
          CommentEdit = nul;
          PostButtons = null;
          reportpostbutton = null; 
        }
        

        if(user.idUser != connected.id) {
          CommentButtons.push(
            <Button onClick={() => this.reportComment(comment.id)} variant="outline-primary" size="sm" className="btn-icon btn-icon-start btn-icon w-100 w-md-auto ms-1">
              <CsLineIcons icon="flag" />
            </Button>
          )
        }
        if(comment.edited == true) {
          editedcomm = "edited"
        }

        if(this.state.post) {
          CommentEdit = <Comment idPost={this.state.post.id}/>
        }
        if(this.state.post && this.state.onEditComment) { 
          CommentEdit = (
          <UpdateComment id={comment.id} commentcontent={comment.commentcontent} onCreated={() => this.loadPost()}/>
          )
        }

        if(connected.id == user.idUser) {
          CommentButtons.push(
            <Button  onClick={() => this.setState({onEditComment : true})} size="sm" variant="outline-primary" className="btn-icon btn-icon-start btn-icon  w-md-auto ms-1">
                <CsLineIcons icon="edit-square"/>
            </Button>
          )
          CommentButtons.push(
            <Button onClick={() => this.AskDeleteComment(comment.id)} size="sm" variant="primary" className="btn-icon btn-icon-start btn-icon  w-md-auto ms-1">
                <CsLineIcons icon="multiply"/>
            </Button>
          )
        }

        if(comment.locked == true){
          if(comment.idUser == connected.id || connected.role == "ADMIN"){

          list.push((
            <Card body className=" mb-5">
               <Row className="g-0 justify-content-end">
               <Col xs="auto">
                 <ul  style={{listStyleType: 'none'}}>
                     <li> <NavLink ><CsLineIcons icon="arrow-double-top" /> </NavLink></li>
                     <li> <p className='small-text text-center mb-0'> {comment.votes}</p></li>
                     <li> <NavLink className='mt-0'><CsLineIcons icon="arrow-double-bottom"  /> </NavLink></li>
             </ul>
             </Col>
                  <Col className="sw-5 d-inline-block position-relative me-3" xs="2">
                    <AvatarFilterComponent userprofile={user}/>
                  </Col>
                <Col className="d-inline-block position-relative text-muted line-through sw-25">
                  <NavLink href={"/profile/" + user.id} >{user?.fname + " " + user?.lname} <span className="text-muted text-small text-right">{date} {time} {ampm} {editedcomm}</span></NavLink>
                  <Col xs="auto">
                <p className="text-medium text-muted line-through text-alternate mt-2">
                    {comment.commentcontent}
                  </p>
                  </Col>
                </Col>
    </Row>
          </Card>
           ));
          }}else if(comment.locked == false) {

          list.push((
            <Card body className="mb-5">
               <Row className="g-0 justify-content-end">
               <Col xs="auto">
                 <ul  style={{listStyleType: 'none'}}>
                     <li> <NavLink onClick={() => this.onUpvoteClick(comment.id)}><CsLineIcons icon="arrow-double-top" /> </NavLink></li>
                     <li> <p className='small-text text-center mb-0'> {comment.votes}</p></li>
                     <li> <NavLink className='mt-0' onClick={() => this.onDownVoteClick(comment.id)}><CsLineIcons icon="arrow-double-bottom"  /> </NavLink></li>
             </ul>
             </Col>
                  <Col className="sw-5 d-inline-block position-relative me-3" xs="2">
                    <img src={"/img/profile/"+user?.avatar} className="img-fluid rounded-xl" alt="thumb" />
                  </Col>
                <Col className="d-inline-block position-relative sw-25">
                  <NavLink href={"/profile/" + user.id} >{user?.fname + " " + user?.lname} <span className="text-muted text-small text-right">{date} {time} {ampm} {editedcomm}</span></NavLink>
                  <Col xs="auto">
                <p className="text-medium text-alternate mt-2">
                    {comment.commentcontent}
                  </p>
                  </Col>
                </Col>
                
                   <Col xs="auto" className="ps-3">
                  {CommentButtons}
                               </Col></Row>
          </Card>
           ));

        }
   
      }
     }

    return (
      <>
        <HtmlHead title={this.title} description={this.description} />
        <Row>
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">Blog</h1>
            <BreadcrumbList items={this.state.breadcrumbs} />
          </Col>
        </Row>
        <div>
        { Post }
          </div>
              <ul/>
              <Row className="g-5">
        <Col xl="8" xxl="9" className="mb-5"></Col>
        { list }
         </Row>

          {CommentEdit}

                    {/* Confirm Post Deletion */}
          <ConfirmationModal
            show={this.state.showDeletePostModal}
            onCancel={() => this.setState({ showDeletePostModal: false })}
            onConfirmation={() => this.DeletePost()}
          >
            <p>
              Are you sure you want to delete this post? <th></th>
              This action can not be reverted.
            </p>
          </ConfirmationModal>
          {/* Confirm Comment Deletion */}
          <ConfirmationModal
            show={this.state.showDeleteCommentModal}
            onCancel={() => this.setState({ showDeleteCommentModal: false })}
            onConfirmation={() => this.DeleteComment()}
          >
            <p>
              Are you sure you want to delete this comment? <th></th>
              This action can not be reverted.
            </p>
          </ConfirmationModal>
          <ReportUserComp list={Object.values(ReportPostCommentList)} type={this.state.reportType} targetId={this.state.reportTargetId} show={this.state.showModal} onHide={() => this.setState({ showModal: false })}/>
      
          {/* Confirm Post Lock */}

          <ConfirmationModal
            show={this.state.showDisablePostModal}
            onCancel={() => this.setState({ showDisablePostModal: false })}
            onConfirmation={() => this.DisableContent()}
          >
            <p>
              Are you sure you want to lock this content? <th></th>
            </p>
          </ConfirmationModal>
      </>
    );
  }
};

export default BlogPost;
