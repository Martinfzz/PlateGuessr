import React from "react";
import { MDBBadge } from "mdb-react-ui-kit";
import { Col, Row } from "react-bootstrap";
import CountUp from "react-countup";
import ProgressBar from "./ProgressBar";

const Round = ({
  selectedElement,
  currentRound,
  score,
  gameOptions,
  addedTime,
  setEndGame,
  showEndGameModal,
  setFinalScore,
}) => {
  return (
    <>
      {gameOptions.gameMode !== "5" && (
        <ProgressBar
          addedTime={addedTime}
          setEndGame={setEndGame}
          showEndGameModal={showEndGameModal}
          setFinalScore={setFinalScore}
        />
      )}
      <h4 className="d-flex justify-content-center">
        <MDBBadge
          className="round-name-badge ms-2 d-flex align-middle"
          color=""
        >
          {gameOptions.gameMode !== "5"
            ? selectedElement.id
            : `${selectedElement.id} - ${selectedElement.name}`}
        </MDBBadge>
      </h4>

      <h4 className="d-flex justify-content-end">
        <MDBBadge className="round-score-badge ms-2" color="">
          <Row>
            <Col>
              <Col className="mb-2 round-text">Round</Col>
              <Col>
                {currentRound} / {gameOptions.numberOfRounds}
              </Col>
            </Col>
            <Col>
              <Col className="mb-2 round-text">Score</Col>
              <Col>
                <CountUp
                  duration={2}
                  separator=" "
                  start={score.before}
                  end={score.after}
                />
              </Col>
            </Col>
          </Row>
        </MDBBadge>
      </h4>
    </>
  );
};

export default Round;
