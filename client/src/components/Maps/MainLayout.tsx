import React from "react";
import MapComponent from "./MapComponent";
import GameModal from "../GameModal";
import Round from "../Round";
import EndGameModal from "../EndGameModal";
import CountriesLayer from "./CountriesLayer";
import CountryLayer from "./CountryLayer";
import SelectedCountry from "./SelectedCountry";
import { MDBBtn } from "mdb-react-ui-kit";
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import BorderEffect from "./BorderEffect";
import useGame from "../../hooks/useGame";
import { useSelector } from "react-redux";
import { GameOptions, PlayedCountryInfo } from "shared.types";
import { MapRef } from "react-map-gl";

interface GameState {
  game: {
    gameOptions: GameOptions;
    playedCountryInfo: PlayedCountryInfo;
    isPlaying: boolean;
  };
}

const MainLayout = () => {
  const { t } = useTranslation();
  const {
    showPopupInfo,
    showGameModal,
    showEndGameModal,
    showEffect,
    selectedElements,
    selectedCountryNames,
    layerRef,
    mapRef,
    score,
    currentRound,
    guessesCount,
    goodGuess,
    addedTime,
    onHover,
    handleClick,
    handleOnPlay,
    handleOnBack,
    handleNewGame,
    handleOnPlayAgain,
    setEndGame,
    setNewRound,
    setShowGameModal,
  } = useGame();
  const { gameOptions, playedCountryInfo, isPlaying } = useSelector(
    (state: GameState) => state.game
  );

  return (
    <MapComponent
      mapRef={mapRef as React.MutableRefObject<MapRef>}
      onHover={onHover}
      handleClick={handleClick}
      layerId={layerRef.current}
    >
      {!isPlaying && <Navbar />}

      {showEffect && <BorderEffect goodGuess={goodGuess.current} />}

      {playedCountryInfo.countryId === 0 ? (
        <CountriesLayer />
      ) : (
        <CountryLayer />
      )}

      {playedCountryInfo.countryId !== 0 &&
        selectedElements.current.length > 0 && (
          <Round
            selectedElement={
              selectedElements.current.at(-1) ?? { id: "", name: "" }
            }
            currentRound={currentRound.current}
            score={score.current}
            addedTime={addedTime.current}
            setEndGame={() => setEndGame()}
            showEndGameModal={showEndGameModal}
            setFinalScore={(time) => (score.current.time = time * 100)}
          />
        )}

      {gameOptions.gameMode === "5" &&
        (guessesCount.current === 0 || goodGuess.current) && (
          <div className="d-grid gap-2 col-12 d-flex justify-content-center btn-next">
            <MDBBtn style={{ boxShadow: "none" }} onClick={() => setNewRound()}>
              {selectedElements.current.length !== 1
                ? t("app_common.next")
                : t("app_common.finish")}
            </MDBBtn>
          </div>
        )}

      {showPopupInfo && playedCountryInfo.countryId === 0 && (
        <SelectedCountry handleOnPlay={handleOnPlay} />
      )}

      {showGameModal && selectedCountryNames.current.length > 0 && (
        <GameModal
          showGameModal={showGameModal}
          setShowGameModal={() => setShowGameModal(false)}
          handleNewGame={(values) => handleNewGame(values)}
          selectedCountryNamesLength={selectedCountryNames.current.length}
        />
      )}

      {showEndGameModal && (
        <EndGameModal
          showEndGameModal={showEndGameModal}
          handleOnBack={handleOnBack}
          handleOnPlayAgain={handleOnPlayAgain}
          score={score.current}
        />
      )}
    </MapComponent>
  );
};

export default MainLayout;
