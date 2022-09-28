import React,{Component} from 'react';

import {Button, Col, Form, Row, Card, NavLink} from 'react-bootstrap';
import authService from 'services/authService';
import UserService from 'services/UserService';
import { blogService } from 'services';


class UpdateComment extends Component {

    constructor(props) {
      super(props)
      this.state = {
        commentcontent: props.commentcontent,
        id : props.id,

      }
    }
 
    onContentChange = event => {
      this.setState({
        commentcontent: event.target.value
      });
    }
  
    onComment = () => {
     
        blogService.updateComment(this.state.id, {
            params:{
                commentcontent : this.state.commentcontent
            }
          }).then( () => {
        this.props.onCreated()
        this.setState({ commentcontent: "" });
      }    
      )

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
        <Form onSubmit={(event) => this.onSubmit(event)} >
        <NavLink to="#">{authService.getCurrentUser()?.firstname + " " + authService.getCurrentUser()?.lastname}</NavLink>
          <Form.Control as="textarea" value={this.state.commentcontent} onChange={this.onContentChange} />
          <Button className="mt-2" size="sm" type="submit" onClick={this.onComment}>COMMENT</Button>
      </Form>
      </Col>
      </Row>
      </Card>
      );
    }
  }
 
  export default UpdateComment;