import React,{Component} from 'react';

import { DropdownButton, ButtonGroup, Dropdown, Card, NavLink } from 'react-bootstrap';
import {Button, Col, Form, Row} from 'react-bootstrap';
import authService from 'services/authService';
import { supportService } from 'services';
import SupportCategory from './SupportCategory';
import SupportStatus from './SupportSatus';
import UserService from 'services/UserService';

class Question extends Component {

    constructor(props) {
      super(props)
      this.state = {
        content: null,
        category: SupportCategory.TECHNICAL,
        status: SupportStatus.OPEN,
        Avatar : UserService.getProfileData() != null && UserService.getProfileData().avatar != undefined ? UserService.getProfileData().avatar : "31.png"    
      }
    }

    onCategoryChange = category => {
      this.setState({
        category
      })
      this.props.onChange(category)
    }
 
    onContentChange = event => {
      this.setState({
        content: event.target.value
      });
    }
  
    onQuestionClick = () => {

      supportService.post({
        content : this.state.content,
        category : this.state.category,
        status : this.state.status,
        idUser : authService.getCurrentUser().id,

      }).then( () => {
        this.props.onCreated()
        this.setState({ content: "" });
      }    
      )
    };

    render() {
      return (
        <Card body>
           <Row className="mb-0">
           <Col xs="auto">
           <div className="sw-8 ">
             <img src={"/img/profile/"+UserService.getProfileData()?.avatar} className="img-fluid rounded-xl" alt="thumb" />
           </div>
         </Col>

           
              <Col xl="11">
              <NavLink to="#">{UserService.getProfileData()?.fname + " " + UserService.getProfileData()?.lname}</NavLink>
              <DropdownButton size="sm" as={ButtonGroup} title={`${this.state.category}`} variant="outline-primary" className="mb-1" onChange={this.onCategoryChange}>
                      <Dropdown.Item action onClick={() => this.onCategoryChange(SupportCategory.TECHNICAL)}>
                      {SupportCategory.TECHNICAL}
                      </Dropdown.Item>
                      <Dropdown.Item action onClick={() => this.onCategoryChange(SupportCategory.REPORT)}>
                      {SupportCategory.REPORT}
                      </Dropdown.Item>
                      <Dropdown.Item action onClick={() => this.onCategoryChange(SupportCategory.CLAIM)}>
                      {SupportCategory.CLAIM}
                      </Dropdown.Item>
                    </DropdownButton>
                <Col xs={20}>
                  <Form.Control as="textarea" placeholder="What's your issue?" value={this.state.content} onChange={this.onContentChange} />
                  <Button size="sm" className="mt-2" onClick={this.onQuestionClick}>POST</Button>

                </Col>
              
              </Col>
              
                </Row>
                </Card>
            
 
      );
    }
  }
 
  export default Question;