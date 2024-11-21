import React from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";

const ConfirmationModal = ({
  showModal,
  handleOnClick,
  handleOnClose,
  title,
  text,
  isLoading,
}) => {
  return (
    <>
      <MDBModal open={showModal} onClose={handleOnClose} tabIndex="-1">
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>{title}</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>{text}</MDBModalBody>

            <MDBModalFooter>
              <MDBBtn
                onClick={handleOnClose}
                color="dark"
                outline
                disabled={isLoading}
              >
                Cancel
              </MDBBtn>
              <MDBBtn
                onClick={handleOnClick}
                color="danger"
                outline
                disabled={isLoading}
              >
                Confirm
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default ConfirmationModal;
