import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import authService from 'services/authService';
import UserService from 'services/UserService';

const NewSupport = function (props) {
  const answers = []

  const fillAdmin = function(answer, date, time, user, index) {
    return (
      <Row className="g-0">
        <Col className="justify-content-start align-items-center text-semi-large text-muted d-none d-md-flex order-md-3">{ date } - { time }</Col>
        <Col xs="auto" className="sw-7 d-flex flex-column justify-content-center align-items-center position-relative me-4 ms-0 ms-md-4 order-md-2">
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
            <div className="w-100 d-flex h-100" />
          </div>
          <div className="bg-foreground sw-7 sh-7 rounded-lg shadow d-flex flex-shrink-0 justify-content-center align-items-center mt-n2 position-relative">
            <div className="bg-gradient-light sw-5 sh-5 rounded-md">
              <div className="text-white d-flex justify-content-center align-items-center h-100">{ index }</div>
            </div>
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
            <div className="w-100 d-flex h-100" />
          </div>
        </Col>
        <Col className="mb-2 order-md-1">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column justify-content-start">
              <div className="d-flex flex-column">
                <Button variant="link" className="p-0 heading text-start text-md-end stretched-link">
                  Admin
                </Button>
                <div className="text-alternate d-md-none mb-2">{ date } - { time }</div>
                <div className="text-muted">{ answer.answercontent }</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  }

  const fillUser = function(answer, date, time, user, index) {
    return (
      <Row className="g-0">
        <Col className="mb-2 justify-content-end align-items-center text-semi-large text-muted d-none d-md-flex">{date} - {time}</Col>
        <Col xs="auto" className="sw-7 d-flex flex-column justify-content-center align-items-center position-relative me-4 ms-0 ms-md-4">
          <div className="w-100 d-flex h-100" />
          <div className="bg-foreground sw-7 sh-7 rounded-lg shadow d-flex flex-shrink-0 justify-content-center align-items-center mt-n2 position-relative">
            <div className="bg-gradient-light sw-5 sh-5 rounded-md">
              <div className="text-white d-flex justify-content-center align-items-center h-100">{ index  }</div>
            </div>
          </div>
          <div className="w-100 d-flex h-100 justify-content-center position-relative">
            <div className="line-w-1 bg-separator h-100 position-absolute" />
          </div>
        </Col>
        <Col className="mb-2">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column justify-content-start">
              <div className="d-flex flex-column">
                <Button variant="link" className="p-0 heading text-start stretched-link">
                  { user.fname } { user.lname }
                </Button>
                <div className="text-alternate d-md-none mb-2">{date} - {time}</div>
                <div className="text-muted">
                  { answer.answercontent }
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    )
  }

  for (const index in props.answers) {
    const answer = props.answers[index]
    const jdate = new Date(answer.createdAt)
    const date = jdate.toLocaleDateString();
    const time = jdate.toLocaleTimeString().slice(0, 5);
    const user = answer.profileUser;
    const counter = props.answers.length - index;

    console.log('ANSWER USER ID - ', user.id)

    if (authService.getCurrentUser().role === 'ADMIN' || user.id !== UserService.getProfileData().id) {
      answers.push(fillAdmin(answer, date, time, user, counter))
    } else {
      answers.push(fillUser(answer, date, time, user, counter))
    }
  }

  return (
    <>
      { answers }
    </>
  );
};

export default NewSupport;
