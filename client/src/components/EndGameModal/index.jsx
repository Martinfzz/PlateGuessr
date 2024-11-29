import React, { useEffect, useState } from "react";
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

const EndGameModal = ({
  score,
  showEndGameModal,
  handleOnBack,
  handleOnPlayAgain,
  gameOptions,
  countryId,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(loadingTypes.none);
  const [userBestScore, setUserBestScore] = useState(null);

  const getUserBestScore = async () => {
    setLoading(loadingTypes.index);
    await API.get(
      `/api/score/country/game_mode/user?token=${user.token}&countryId=${countryId}&gameModeId=${gameOptions.gameMode}`
    )
      .then((res) => {
        setUserBestScore(res.data.best_score);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(loadingTypes.none);
  };

  const saveScore = async () => {
    setLoading(loadingTypes.create);
    await API.post(
      `/api/country/save_score?token=${user.token}&countryId=${countryId}&gameModeId=${gameOptions.gameMode}&score=${score.after}`
    )
      .then((res) => {})
      .catch((error) => {
        console.log(error);
      });
    setLoading(loadingTypes.none);
    getUserBestScore();
  };

  useEffect(() => {
    if (user) saveScore();
  }, []);

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
            {gameOptions.gameMode !== "5" && (
              <MDBModalBody>
                {user ? (
                  loading ? (
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
                to={`/country/${countryId}`}
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
