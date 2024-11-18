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

const EndGameModal = ({
  score,
  showEndGameModal,
  handleOnBack,
  handleOnPlayAgain,
}) => {
  return (
    <>
      <MDBModal tabIndex="-1" open={showEndGameModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Final Score: {score.after}</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              <p>In Progress</p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                rounded
                className="btn-back"
                color="light"
                onClick={handleOnBack}
              >
                Back
              </MDBBtn>
              <MDBBtn
                rounded
                className="btn-play-again"
                color="light"
                onClick={handleOnPlayAgain}
              >
                Play again
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default EndGameModal;
