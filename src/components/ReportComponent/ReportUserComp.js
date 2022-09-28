import { findIndex } from '@amcharts/amcharts5/.internal/core/util/Array';
import React, { Component } from 'react';

import { Col, Row, Modal, Card, Form, Button } from 'react-bootstrap';
import { reportService } from 'services';
import authService from 'services/authService';

class ReportUserComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: ' ',
      customReason: '',
      visibility: 'invisible',
    };
    this.sthgelse = React.createRef();
  }

  setVisibility(state) {
    this.setState({
      visibility: state,
    });
  }

  onReasonChange = (reason) => {
    this.setState({
      reason,
    });
  };

  onLastReasonChange(reason) {
    this.setState({
      reason,
    });
    this.sthgelse.current.click();
    this.setVisibility('visible');
  }

  onCustomReasonChange = (reason) => {
    this.setState({
      customReason: reason.target.value,
    });
  };

  onReport = () => {
    console.log(this.isCustomReason() ? this.state.customReason : this.state.reason);
    reportService
      .post({
        reporter: authService.getCurrentUser().id,
        reason: this.isCustomReason() ? this.state.customReason : this.state.reason,
        targetId: this.props.targetId,
        type: this.props.type,
      })
      .then(() => {
        this.props.onHide();
      });
  };

  isCustomReason() {
    return this.state.reason === this.props.list[this.props.list.length - 1] && this.state.customReason;
  }

  render() {
    const list = [];
    this.props.list.forEach((reason, index) => {
      if (this.props.list.length - 1 === index) {
        list.push(
          <div>
            <Form.Check
              className="mt-2 mb-2"
              action
              onClick={() => this.onLastReasonChange(reason)}
              type="radio"
              label={reason}
              id="inlineRadio5"
              inline
              name="inlineRadio"
            ></Form.Check>
          </div>
        );
      } else {
        list.push(
          <div>
            <Form.Check
              className="mt-2"
              action
              onClick={() => this.onReasonChange(reason)}
              type="radio"
              label={reason}
              id="inlineRadio1"
              inline
              name="inlineRadio"
            ></Form.Check>
          </div>
        );
      }
    });

    return (
      <Modal className="modal-close-out" show={this.props.show}>
        <Modal.Body>
          <Row>
            <Col>
              <div className="mb-0">
                <h2>Report</h2>
                <div>
                  {list}
                  <Form.Control
                    className={this.state.visibility}
                    ref={this.sthgelse}
                    type="textarea"
                    placeholder="Something else..."
                    onChange={this.onCustomReasonChange}
                  ></Form.Control>
                </div>
              </div>
              <Row className="g-0 justify-content-end mt-2">
                <Col xs="auto" className="ps-3">
                  <Button size="sm" variant="secondary" onClick={() => this.props.onHide()}>
                    Cancel
                  </Button>
                  <span> </span>
                  <Button size="sm" onClick={() => this.onReport()}>
                    SUBMIT
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ReportUserComp;
