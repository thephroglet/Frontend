import React from 'react';

import CsLineIcons from 'cs-line-icons/CsLineIcons';
import {Row, Col, Card, NavLink, Button } from 'react-bootstrap';
import HtmlHead from 'components/html-head/HtmlHead';
import 'intro.js/introjs.css';
import authService from 'services/authService';
import Question from 'components/SupportComponent/Question';
import { supportService } from 'services'
import SupportCategory from 'components/SupportComponent/SupportCategory';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import UserService from 'services/UserService';

class Support extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      breadcrumbs : [
        { to: '', text: 'Home' },
        ],
      questions: [],
      category : SupportCategory.TECHNICAL,
      Avatar : UserService.getProfileData() != null && UserService.getProfileData().avatar != undefined ? UserService.getProfileData().avatar : "29.png"    
    }
  }

  componentDidMount() {
    this.loadQuestions()
  }

  onCategoryChange = (category) => {
    category = this.state.category
}

  loadQuestions(){
    let request = null
    const user = authService.getCurrentUser()
    if(user.role == "ADMIN"){
      request = supportService.all()
    } else {
      request = supportService.getByUserId()
    }
   request.then(question => {
      this.setState({
        questions: question.data
      })
      console.log(question.data)
    })
  }


  title = 'Support';
  description = 'Support';

 
  

  render() {
    const list = []
    const connected = authService.getCurrentUser()
    let addQuestion = null;

    if(connected.role == "USER"){
      addQuestion = <Question onCreated={() => this.loadQuestions()}  onChange={(category) => this.onCategoryChange(category)}/>

    } else if(connected.role == "ADMIN"){
      addQuestion = null
    }

     for( let index in this.state.questions){
      if (this.state.questions[index] === undefined || this.state.questions[index] === null)
        continue
       const question = this.state.questions[index].question;
       const user = this.state.questions[index].userprofile;
       const answersCount = this.state.questions[index].question.answers.length
       const jdate = new Date(question.createdAt)
       const date = jdate.toLocaleDateString();
       const time = jdate.toLocaleTimeString().slice(0, 5);
       console.log(question.category)
       

       list.push((
        <Card className="mb-5" body>
                           
                    <Row className="align-items-center">
                      
               <Col xs="11">
              <div className="d-flex align-items-center">
              <div className="sw-5 d-inline-block position-relative me-3">
        <img src={"/img/profile/"+user?.avatar} width="75" className="img-fluid rounded-xl" alt="thumb" />
      </div>
                <div className="d-inline-block">
                  <NavLink to="#">{user?.fname + " " + user?.lname} <span className="text-muted text-small text-right">{date} {time}</span></NavLink>
                </div>
                
              </div>
            </Col>
            <Col >
            <Button variant="outline-primary" size="sm">{question.category}</Button>
            </Col>
            </Row>
        <Card body>
          <h4 className="mb-3">
            {question.content}
          </h4>
          {Image}
        </Card>
        <Card.Footer className="border-0 pt-0">
            <Col xs="12">
              <Row className="g-0 justify-content-end">
                <Col xs="auto" className="ps-3">
                  <NavLink href={`/support/question/${question.id}`}>
                    <CsLineIcons icon="message" size="20" className="text-primary me-1" />
                    <span className="align-middle">Answers ({ answersCount })</span>
                  </NavLink>
                </Col>
              </Row>
            </Col>
        </Card.Footer>
      </Card>
       ))
     }
      

        

    return (
      <>
        <HtmlHead title={this.title} description={this.description} />
        <div className="page-title-container">
        <Row>
          <Col md="7">
            <h1 className="mb-0 pb-0 display-4">Support</h1>
            <BreadcrumbList items={this.state.breadcrumbs} />
          </Col>
        </Row>
      </div>
       
        <div>
          {addQuestion}
          </div>
              <ul/>

              
              <Row className="g-5">
        <Col xl="8" xxl="9" className="mb-5"></Col>
        { list }
         </Row>
       
      </>

    );
  }
};

export default Support;
