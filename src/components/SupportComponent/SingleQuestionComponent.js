import React from 'react';

import CsLineIcons from 'cs-line-icons/CsLineIcons';
import {Row, Col, Card, NavLink, Form, Button, Modal } from 'react-bootstrap';
import Clamp from 'components/clamp';
import HtmlHead from 'components/html-head/HtmlHead';
import 'intro.js/introjs.css';
import authService from 'services/authService';
import BreadcrumbList from 'components/breadcrumb-list/BreadcrumbList';
import { supportService } from 'services'
import SupportCategory from './SupportCategory';
import UserService from 'services/UserService';
import NewSupport from 'views/blocks/steps/NewSupport';

class SingleQuestionComponent extends React.Component {

  constructor(props) {
    super(props)
    this.idQuestion = this.props.match.params.id;
    this.state = {
      status : SupportCategory.OPEN,
      breadcrumbs : [
        { to: '', text: 'Home' },
        { to: 'profile', text: 'Profile' },
        { to: 'support', text: 'Support' },
        ],
      answers : null,
      answercontent : null,
      question: null,
      userprofile: null,
      verticallyCenteredExample : false,
      Avatar : UserService.getProfileData() != null && UserService.getProfileData().avatar != undefined ? UserService.getProfileData().avatar : "29.png"    
    }
  }

  onSubmit(event) {
    event.preventDefault()
    if (!this.answercontent)
      return
    supportService.addAnswer({
      answercontent: this.answercontent,
      idQuestion: this.state.question.id,
      idUser: authService.getCurrentUser().id
    }).then(() => {
      this.answercontent = ""
      this.loadQuestion();
    });
  }

  setVerticallyCenteredExample(state, SupportId) {
    this.setState({
      verticallyCenteredExample : state,
      SupportId
    })
  }

  onAnswerContentChange = answercontent => {
    this.setState({
      answercontent
    })
  }

  componentDidMount() {
    this.loadQuestion()
  }

  closeSupport() {
    supportService.put(null, {
      params: {
        id: this.state.question.id
      }
    }).then(() => {
      this.loadQuestion();
      this.setVerticallyCenteredExample(false)
    })
  }

  /*
  refreshPage = ()=>{
    window.location.reload();
 }*/

  loadQuestion(){
    supportService.get(this.idQuestion).then(question => {
      this.setState({
        question: question.data.question,
        userprofile: question.data.userprofile, 
        answers: question.data.answers
      })
      console.log(question.data)
    })
  }

  title = 'Support';
  description = 'Support';

  render() {
    const list = []
    let question = null
    let status = null
    let answer = null
    let newSupport = null

    const connected = authService.getCurrentUser()
    if (this.state.question){
      if(this.state.question.status == "OPEN" && connected.role == "ADMIN") {
        status = <Button onClick={() => this.setVerticallyCenteredExample(true, this.state.question?.id)} variant="outline-success" className="mt-1" size="sm">{this.state.question.status}</Button>
        answer =(
          <Card>
          <Card.Body>
          <div>
                
          <Row className="g-0">
              <Col xs="auto">
                <div className="sw-5 me-3">
                  <img src={"/img/profile/"+UserService.getProfileData()?.avatar} className="img-fluid rounded-xl" alt="thumb" />
                </div>
              </Col>
          <Col>
               <Form onSubmit={(event) => this.onSubmit(event)} >
                <NavLink to="#">{authService.getCurrentUser()?.firstname + " " + authService.getCurrentUser()?.lastname}</NavLink>
                  <Form.Control as="textarea" placeholder="What's on your mind..." value={this.answercontent} onChange={(event) => (this.answercontent = event.target.value)} />
                  <Button className="mt-2" size="sm" type="submit">Reply</Button>
              </Form>
              </Col>
              </Row>
              </div>
              </Card.Body>
          </Card>
        )
      }
    if(this.state.question.status == "OPEN" && connected.role == "USER"  && this.state.question.idUser == connected.id){
      status = <Button variant="outline-success" className="mt-1" size="sm">{this.state.question.status}</Button>
      answer =(
        <Card>
        <Card.Body>
        <div>
              
        <Row className="g-0">
            <Col xs="auto">
              <div className="sw-5 me-3">
                <img src={"/img/profile/"+UserService.getProfileData()?.avatar} className="img-fluid rounded-xl" alt="thumb" />
              </div>
            </Col>
        <Col>
             <Form onSubmit={(event) => this.onSubmit(event)} >
              <NavLink to="#">{authService.getCurrentUser()?.firstname + " " + authService.getCurrentUser()?.lastname}</NavLink>
                <Form.Control as="textarea" placeholder="What's on your mind..." value={this.answercontent} onChange={(event) => (this.answercontent = event.target.value)} />
                <Button className="mt-2" size="sm" type="submit">ANSWER</Button>
            </Form>
            </Col>
            </Row>
            </div>
            </Card.Body>
        </Card>
      )
    }
   
    else if(this.state.question.status == "CLOSED") {
      status = <Button variant="danger" className="mt-1" size="sm">{this.state.question.status}</Button>
      
    }}

     if (this.state.question) {
        let answercount = this.state.question.answers.length
        const jdate = new Date(this.state.question.createdAt)
        const date = jdate.toLocaleDateString();
        const time = jdate.toLocaleTimeString().slice(0, 5);

        /*
          setInterval(() => {
            this.loadQuestion();
          }, 5000)
         */
        
      question = (
        <Card className="mb-1" body>
                    <Row className="align-items-center">
               <Col xs="11">
              <div className="d-flex align-items-center">
              <div className="sw-8 d-inline-block position-relative me-2">
        <img src={"/img/profile/"+this.state.userprofile.avatar} width="75" className="img-fluid rounded-xl" alt="thumb" />
      </div>
                <div className="d-inline-block">
                  <NavLink to="#"> {this.state.userprofile.fname + " " + this.state.userprofile.lname} <span className="text-muted text-small text-right">{date} {time}</span></NavLink>
                </div>
                
              </div>
            </Col>
            <Col className="justify-content-end mx-0">
            <Button size="sm" variant="outline-primary" >{this.state.question.category}</Button>
           {status}
            
            </Col>
            </Row>
        <Card body>
          <h4 className="mb-3">
            {this.state.question.content}
          </h4>
          {Image}
        </Card>
        <Card.Footer className="border-0 pt-0">
            <Col xs="12">
              <Row className="g-0 justify-content-end">
                <Col xs="auto" className="ps-3">
                    <CsLineIcons icon="message" size="20" className="text-primary me-1" />
                    <span className="align-middle small-text">Answers ({answercount})</span>
                </Col>
              </Row>
            </Col>
        </Card.Footer>
      </Card>
      )
     }

     if (this.state.question) {
      newSupport = <NewSupport answers={this.state.question.answers.reverse()} />
      /*
      for( let index in this.state.question.answers){
        const answer = this.state.question.answers[index];
        const jdate = new Date(answer.createdAt)
        const date = jdate.toLocaleDateString();
        const time = jdate.toLocaleTimeString().slice(0, 5);
        const user = answer.profileUser;
        console.log(answer)
        list.push((
         <Card className="mb-5">
         <Card.Body>
           <Row className="g-0">
             <Col xs="auto">
               <div className="sw-5 me-3">
                 <img src={"/img/profile/"+user?.avatar} className="img-fluid rounded-xl" alt="thumb" />
               </div>
             </Col>
             <Col>
               <NavLink to="#">{user?.fname + " " + user?.lname} <span className="text-muted text-small text-right">{date} {time}</span></NavLink>
               <Clamp clamp="2" tag="div" className="text-medium text-alternate mb-1 clamp-line">
                 {answer.answercontent}
               </Clamp>
             </Col>
           </Row>
         </Card.Body>
       </Card>
        ));
      }
      */
     }

    return (
      <>
        <HtmlHead title={this.title} description={this.description} />
        <Col md="7" className="mb-5">
            <h6 className="mb-0 pb-0 display-7">Support</h6>
            <BreadcrumbList items={this.state.breadcrumbs}  />
          </Col>
        <div>
        { question }
          </div>
              <ul/>
              <Row className="g-5">
        <Col xl="8" xxl="9" className="mb-5" />
          { newSupport }
         </Row>

         {answer}
        
         <section>
          <Modal className="modal-close-out" show={this.state.verticallyCenteredExample} SupportId={this.state.question?.id} onHide={() => this.setVerticallyCenteredExample(false)} centered>
                <Modal.Body>
                  <p>
                    Are you sure you want to close this ticket? <th></th>
                    This action can not be reverted.
                  </p>
                </Modal.Body>
                <Modal.Footer>
                  <Button closeButton variant="secondary" onClick={() => this.setVerticallyCenteredExample(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => this.closeSupport()}>CLOSE</Button>
                </Modal.Footer>
              </Modal>
            
              </section>
      </>
    );
  }
};

export default SingleQuestionComponent;
