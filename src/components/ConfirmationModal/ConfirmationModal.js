import React, { Component } from 'react';

import { Col, Row, Modal, Button } from 'react-bootstrap';

class ConfirmationModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let title = null
    if (this.props.title) {
      title = <h2>{this.props.title}</h2>
    }
    return (
      <Modal className="modal-close-out" show={this.props.show}>
        <Modal.Body>
          <Row>
            <Col>
              <div className="mb-0">
                {title}
                {this.props.children}
              </div>
              <Row className="g-0 justify-content-end mt-2">
                <Col xs="auto" className="ps-3">
                  <Button size="sm" variant="secondary" onClick={() => this.props.onCancel()}>
                  { this.props.cancelLabel || 'Cancel' }
                  </Button>
                  <span> </span>
                  <Button size="sm" onClick={() => this.props.onConfirmation()}>
                  { this.props.confirmationLabel || 'Confirm' }
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

export default ConfirmationModal;