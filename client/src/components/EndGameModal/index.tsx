import React, { FC, useCallback, useEffect, useState } from "react";
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
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { API, loadingTypes } from "../../shared/helpers";
import { CustomSpinner } from "../../shared/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { GameOptions, PlayedCountryInfo } from "../../shared.types";

interface EndGameModalProps {
  score: {
    before: number;
    after: number;
    time: number;
  };
  showEndGameModal: boolean;
  handleOnBack: () => void;
  handleOnPlayAgain: () => void;
}

interface GameState {
  game: {
    gameOptions: GameOptions;
    playedCountryInfo: PlayedCountryInfo;
  };
}

const EndGameModal: FC<EndGameModalProps> = ({
  score,
  showEndGameModal,
  handleOnBack,
  handleOnPlayAgain,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const { gameOptions, playedCountryInfo } = useSelector(
    (state: GameState) => state.game
  );
  const [loading, setLoading] = useState(loadingTypes.none);
  const [userBestScore, setUserBestScore] = useState<number>(0);

  const getUserBestScore = useCallback(async () => {
    setLoading(loadingTypes.index);
    await API.get(
      `/api/score/country/game_mode/user?token=${user?.token}&countryId=${playedCountryInfo.countryId}&gameModeId=${gameOptions.gameMode}`
    )
      .then((res) => {
        setUserBestScore(res.data.best_score);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(loadingTypes.none);
  }, [gameOptions.gameMode, playedCountryInfo.countryId, user?.token]);

  const saveScore = useCallback(async () => {
    setLoading(loadingTypes.create);
    await API.post(
      `/api/country/save_score?token=${user?.token}&countryId=${playedCountryInfo.countryId}&gameModeId=${gameOptions.gameMode}&score=${score.after}`
    )
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
    setLoading(loadingTypes.none);
    getUserBestScore();
  }, [
    gameOptions.gameMode,
    getUserBestScore,
    playedCountryInfo.countryId,
    score.after,
    user?.token,
  ]);

  useEffect(() => {
    if (user) saveScore();
  }, [user, saveScore]);

  return (
    <>
      <MDBModal
        tabIndex="-1"
        open={showEndGameModal}
        data-testid="end-game-modal"
      >
        <MDBModalDialog centered>
          <MDBModalContent className="end-game-modal">
            <MDBModalHeader>
              <MDBModalTitle>
                {t("game.final_score")}: {score.after}
              </MDBModalTitle>
            </MDBModalHeader>
            {gameOptions.gameMode !== "5" && (
              <MDBModalBody>
                {user ? (
                  loading !== loadingTypes.none ? (
                    <CustomSpinner center />
                  ) : userBestScore >= score.after ? (
                    <>
                      <p className="d-flex justify-content-center">
                        {t("game.end_game.no_score_beaten")}
                      </p>
                      <p className="d-flex justify-content-center">
                        {t("game.end_game.your_best_score")} {userBestScore}
                      </p>
                    </>
                  ) : (
                    <p className="d-flex justify-content-center">
                      {t("game.end_game.best_score")}
                    </p>
                  )
                ) : (
                  <div>
                    <p className="d-flex justify-content-center">
                      {t("game.end_game.no_connected")}
                    </p>
                    <p className="d-flex justify-content-center">
                      {t("game.end_game.cant_save_score")}
                    </p>
                    <p className="d-flex justify-content-center">
                      {t("game.end_game.save_score")}
                    </p>
                    <div className="d-flex justify-content-center">
                      <Link to={"/signup"}>
                        <MDBBtn
                          rounded
                          className="btn-signup"
                          type="submit"
                          color="light"
                        >
                          {t("app_common.signup")}
                        </MDBBtn>
                      </Link>
                    </div>
                  </div>
                )}
              </MDBModalBody>
            )}
            <MDBModalFooter>
              <Link
                to={`/country/${playedCountryInfo.countryId}`}
                className="stats-link d-flex justify-content-start align-items-center flex-grow-1"
              >
                <h4 className="m-0">
                  <FontAwesomeIcon icon={faChartSimple} />
                </h4>
                <p className="ms-2 m-0 d-flex align-items-center">
                  {t("pages.stats.see_stats")}
                </p>
              </Link>
              <MDBBtn
                rounded
                className="btn-back"
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
