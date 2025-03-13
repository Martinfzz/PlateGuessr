import React, { FC, useState } from "react";
import { MDBBadge, MDBBtn } from "mdb-react-ui-kit";
import { Col, Row } from "react-bootstrap";
import CountUp from "react-countup";
import ProgressBar from "./ProgressBar";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../ConfirmationModal";
import { useSelector } from "react-redux";
import { GameOptions } from "shared.types";

interface RoundProps {
  selectedElement: {
    id: string;
    name: string;
  };
  currentRound: number;
  score: {
    before: number;
    after: number;
    time: number;
  };
  addedTime: number;
  setEndGame: () => void;
  showEndGameModal: boolean;
  setFinalScore: (arg0: number) => number;
}

interface GameState {
  game: {
    gameOptions: GameOptions;
  };
}

const Round: FC<RoundProps> = ({
  selectedElement,
  currentRound,
  score,
  addedTime,
  setEndGame,
  showEndGameModal,
  setFinalScore,
}) => {
  const { t } = useTranslation();
  const { gameOptions } = useSelector((state: GameState) => state.game);
  const [showQuitModal, setShowQuitModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(0);
  };

  return (
    <div data-testid="round">
      {gameOptions.gameMode !== "5" && (
        <ProgressBar
          addedTime={addedTime}
          setEndGame={setEndGame}
          showEndGameModal={showEndGameModal}
          setFinalScore={setFinalScore}
        />
      )}
      <Col className="d-flex justify-content-start position-absolute pt-3 ps-3">
        <Link to={"/"}>
          <MDBBtn
            className="btn-menu-back text-boldgray"
            onClick={() => setShowQuitModal(true)}
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            <span className="hidden-text">{t("app_common.go_back")}</span>
          </MDBBtn>
        </Link>
      </Col>

      <Col>
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
      </Col>

      <h4 className="d-flex justify-content-end">
        <MDBBadge className="round-score-badge ms-2" color="">
          <Row>
            <Col>
              <Col className="mb-2 round-text text-boldgray">
                {t("game.round")}
              </Col>
              <Col>
                {currentRound} / {gameOptions.numberOfRounds}
              </Col>
            </Col>
            <Col>
              <Col className="mb-2 round-text text-boldgray">
                {t("game.score")}
              </Col>
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

      {showQuitModal && (
        <ConfirmationModal
          showModal={showQuitModal}
          handleOnClick={handleOnClick}
          handleOnClose={() => setShowQuitModal(false)}
          title={t("pages.account.are_you_sure")}
          text={t("game.loose_progression")}
        />
      )}
    </div>
  );
};

export default Round;
