import React from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from "mdb-react-ui-kit";
import { Col, Row } from "react-bootstrap";
import EmailForm from "./EmailForm";

const EmailModal = ({ showEmailModal, setShowEmailModal }) => {
  return (
    <MDBModal open={showEmailModal} onClose={setShowEmailModal} tabIndex="-1">
      <MDBModalDialog centered>
        <MDBModalContent className="signup-modal">
          <MDBModalHeader>
            <Col>
              <Row className="d-flex text-center">
                <MDBModalTitle>Almost there!</MDBModalTitle>
              </Row>
              <Row className="d-flex text-center yellow">
                <MDBModalTitle>
                  Just a few more steps and you're ready to go!
                </MDBModalTitle>
              </Row>
            </Col>
            <MDBBtn
              className="btn-close mb-5"
              color="none"
              onClick={setShowEmailModal}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <EmailForm />
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};

export default EmailModal;
