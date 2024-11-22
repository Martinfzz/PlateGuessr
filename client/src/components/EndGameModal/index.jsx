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
import { useTranslation } from "react-i18next";

const EndGameModal = ({
  score,
  showEndGameModal,
  handleOnBack,
  handleOnPlayAgain,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <MDBModal tabIndex="-1" open={showEndGameModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>
                {t("game.final_score")}: {score.after}
              </MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              <p>In Progress</p>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                rounded
                className="btn-game-back"
                color="light"
                onClick={handleOnBack}
              >
                {t("app_common.back")}
              </MDBBtn>
              <MDBBtn
                rounded
                className="btn-play-again"
                color="light"
                onClick={handleOnPlayAgain}
              >
                {t("game.play_again")}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default EndGameModal;
