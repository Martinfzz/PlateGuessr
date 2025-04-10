import React, { FC } from "react";
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
import { useTranslation } from "react-i18next";

interface EmailModalProps {
  showEmailModal: boolean;
  setShowEmailModal: () => void;
}

const EmailModal: FC<EmailModalProps> = ({
  showEmailModal,
  setShowEmailModal,
}) => {
  const { t } = useTranslation();

  return (
    <MDBModal
      open={showEmailModal}
      onClose={setShowEmailModal}
      tabIndex="-1"
      data-testid="email-modal"
    >
      <MDBModalDialog centered>
        <MDBModalContent className="signup-modal">
          <MDBModalHeader>
            <Col>
              <Row className="d-flex text-center">
                <MDBModalTitle data-testid="signup-email-modal-title-1">
                  {t("pages.signup.modal_title_1")}
                </MDBModalTitle>
              </Row>
              <Row className="d-flex text-center yellow">
                <MDBModalTitle data-testid="signup-email-modal-title-2">
                  {t("pages.signup.modal_title_2")}
                </MDBModalTitle>
              </Row>
            </Col>
            <MDBBtn
              className="btn-close mb-5"
              color="none"
              onClick={setShowEmailModal}
              data-testid="close-button"
              tabIndex={2}
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
