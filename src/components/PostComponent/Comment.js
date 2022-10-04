import React,{Component} from 'react';

import {Button, Col, Form, Row, Card, NavLink} from 'react-bootstrap';
import authService from 'services/authService';
import UserService from 'services/UserService';
import { blogService } from 'services';


class Comment extends Component {

    constructor(props) {
      super(props)
      this.state = {
        commentcontent: null,
      }
    }
 
    onContentChange = event => {
      event.preventDefault()
      this.setState({
        commentcontent: event.target.value
      });
    }
  
    onComment = (event) => {
      event.preventDefault();
      blogService.addComment({
        commentcontent: this.state.commentcontent,
        idUser: authService.getCurrentUser().id,
        idPost : this.props.idPost,
      }).then( () => {
        this.setState({ commentcontent: "" })
        this.props.onCommentCreated()
      })
    };

    render() {
      return (
        <Card body>
        <Row className="g-0">
        <Col xs="auto">
          <div className="sw-8 me-3">
            <img src={"/img/profile/"+UserService.getProfileData()?.avatar} className="img-fluid rounded-xl" alt="thumb" />
          </div>
        </Col>
    <Col>
    <Form onSubmit={(event) => this.onContentChange(event)} >
      {/* <Form onSubmit={(e) => e.preventDefault()}>*/}  
        <NavLink to="#">{authService.getCurrentUser()?.firstname + " " + authService.getCurrentUser()?.lastname}</NavLink>
          <Form.Control as="textarea" placeholder ="Share your opinion..." value={this.state.commentcontent} onChange={this.onContentChange} />
          <Button className="mt-2" size="sm" type="submit" onClick={(event) => this.onComment(event)}>COMMENT</Button>
      </Form>
      </Col>
      </Row>
      </Card>
      );
    }
  }

  export default Comment;