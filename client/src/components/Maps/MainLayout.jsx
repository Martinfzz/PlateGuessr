import React, { useState, useCallback, useRef, useEffect } from "react";
import MapComponent from "./MapComponent";
import GameModal from "../GameModal";
import Round from "../Round";
import EndGameModal from "../EndGameModal";
import CountriesLayer from "./CountriesLayer";
import CountryLayer from "./CountryLayer";
import SelectedCountry from "./SelectedCountry";
import { MDBBtn } from "mdb-react-ui-kit";
import Navbar from "../Navbar";

const MainLayout = () => {
  // State variables
  const [hoverInfo, setHoverInfo] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [playedCountryInfo, setPlayedCountryInfo] = useState({ countryId: 0 });
  const [userMarker, setUserMarker] = useState([]);
  const [userMarkerColor, setUserMarkerColor] = useState("#4A7B9D");
  const [answerMarker, setAnswerMarker] = useState([]);
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const [showEffect, setShowEffect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOptions, setGameOptions] = useState({
    toggleColors: true,
    toggleBorders: true,
    toggleLabels: true,
    color: "",
  });

  // Refs for mutable values
  const selectedElements = useRef([]);
  const selectedCountryNames = useRef([]);
  const layerRef = useRef(["countries"]);
  const mapRef = useRef(null);
  const score = useRef({ before: 0, after: 0, time: 0 });
  const currentRound = useRef(1);
  const clickIsDisable = useRef(false);
  const newRoundTimeout = useRef(null);
  const guessesCount = useRef(3);
  const goodGuess = useRef(false);
  const addedTime = useRef(0);

  // Helper function to fetch features from the map
  const getFeatures = (e) => {
    const map = mapRef?.current?.getMap() || null;
    return map?.queryRenderedFeatures(e.point, {
      layers: layerRef.current || null,
    });
  };

  // Handle hover on the map and set hoverInfo
  const onHover = useCallback(async (e) => {
    const features = await getFeatures(e);
    const country = features && features[0];
    setHoverInfo({
      longitude: e.lngLat.lng,
      latitude: e.lngLat.lat,
      countryId: country && country.properties.ID,
    });
  }, []);

  const getRandomUniqueName = (names, usedNames) => {
    let name;
    do {
      name = names[Math.floor(Math.random() * names.length)];
    } while (usedNames.includes(name));
    return name;
  };

  // Select random names from the current country
  const selectRandomElements = async (n) => {
    let elements = [];
    if (n >= selectedCountryNames.current.length) {
      return selectedCountryNames.current;
    }
    for (let i = 0; i < n; i++) {
      const newElem = getRandomUniqueName(
        selectedCountryNames.current,
        elements
      );
      elements.push(newElem);
    }
    selectedElements.current = elements;
  };

  // Handle the start of a new game
  const handleNewGame = async (values) => {
    setIsPlaying(true);
    setShowGameModal(false);
    setPlayedCountryInfo(popupInfo);
    await selectRandomElements(values.numberOfRounds);
    setGameOptions(values);
    score.current = { before: 0, after: 0, time: 0 };
  };

  const toggleLayout = (status) => {
    const map = mapRef?.current?.getMap();
    map.style.stylesheet.layers.forEach(function (layer) {
      if (layer.type === "symbol") {
        map.setLayoutProperty(layer.id, "visibility", status);
      }
    });
  };

  // Hide labels when the toggle is off
  useEffect(() => {
    if (!gameOptions.toggleLabels) toggleLayout("none");
  }, [gameOptions]);

  // Start a new round, resetting markers and check if game is over
  const setNewRound = () => {
    resetMarkers();
    currentRound.current += 1;
    selectedElements.current.pop();
    guessesCount.current = 3;
    goodGuess.current = false;

    if (selectedElements.current.length <= 0) {
      setEndGame();
    }
  };

  const setEndGame = () => {
    clearTimeout(newRoundTimeout.current);
    score.current.after = Math.floor(score.current.after + score.current.time);
    setShowEndGameModal(true);
  };

  const resetMarkers = () => {
    setUserMarker([]);
    setAnswerMarker([]);
    clickIsDisable.current = false; // Prevent multiple click before a new round
  };

  // Set user marker and check if the answer is correct
  const setMarkerCoords = useCallback(
    (e, features) => {
      setUserMarker([{ longitude: e.lngLat.lng, latitude: e.lngLat.lat }]);
      setShowEffect(true);
      setTimeout(() => setShowEffect(false), 2000);

      if (features[0]?.properties.name === selectedElements.current.at(-1).id) {
        setUserMarkerColor("#47A025");
        score.current.before = score.current.after;
        score.current.after = score.current.after + guessesCount.current * 1000;
        goodGuess.current = true;
        addedTime.current = guessesCount.current * 5;
        clearTimeout(newRoundTimeout.current);
      } else {
        setUserMarkerColor("#E3655B");
        guessesCount.current = guessesCount.current - 1;
      }

      if (guessesCount.current === 0) {
        const answerLongitude = selectedElements.current.at(-1).lng;
        const answerLatitude = selectedElements.current.at(-1).lat;
        setAnswerMarker([
          { longitude: answerLongitude, latitude: answerLatitude },
        ]);
        clearTimeout(newRoundTimeout.current);
      }

      newRoundTimeout.current = setTimeout(() => {
        if (gameOptions.gameMode !== "5") {
          if (guessesCount.current === 0 || goodGuess.current) {
            setNewRound();
          } else {
            resetMarkers();
          }
        } else {
          if (guessesCount.current !== 0 && !goodGuess.current) {
            resetMarkers();
          }
        }
      }, 2000);
    },
    [gameOptions.gameMode, goodGuess]
  );

  const handleClickOnCountry = (features) => {
    const country = features && features[0];
    if (country) {
      setPopupInfo({
        longitude: country.properties.LNG,
        latitude: country.properties.LAT,
        zoom: country.properties.ZOOM,
        countryId: country.properties.ID,
        name: country.properties.ADMIN,
        color: country.properties.COLOR,
      });
      setShowPopupInfo(true);
    } else {
      setPopupInfo(null);
      setShowPopupInfo(false);
    }
  };

  // Handle map click
  const handleClick = useCallback(
    async (e) => {
      const features = await getFeatures(e);
      if (playedCountryInfo.countryId === 0) {
        handleClickOnCountry(features);
      } else {
        if (selectedElements.current.length > 0 && !clickIsDisable.current) {
          clickIsDisable.current = true;
          setMarkerCoords(e, features);
        }
      }
    },
    [playedCountryInfo, setMarkerCoords]
  );

  // Handle visibility of map layers based on game options
  useEffect(() => {
    if (playedCountryInfo.countryId !== 0) {
      layerRef.current = ["country"];
      mapRef.current?.flyTo({
        center: [playedCountryInfo.longitude, playedCountryInfo.latitude],
        zoom: playedCountryInfo.zoom,
        duration: 2000,
      });
    } else {
      layerRef.current = ["countries"];
    }
  }, [playedCountryInfo]);

  // Handle when the user click on the country modal to select options
  const handleOnPlay = async () => {
    setShowGameModal(true);
    setShowPopupInfo(false);
    const country = await import(
      `../../assets/metadata/json/${popupInfo.name.toLowerCase()}.json`
    );
    selectedCountryNames.current = country.names;
  };

  // Handle when the user wants to go back to the main map
  const handleOnBack = () => {
    setPlayedCountryInfo({ countryId: 0 });
    setShowEndGameModal(false);
    setIsPlaying(false);
    currentRound.current = 1;
    toggleLayout("visible");
  };

  // Handle when the user wants to play again
  const handleOnPlayAgain = () => {
    setShowEndGameModal(false);
    currentRound.current = 1;
    handleNewGame(gameOptions);
  };

  return (
    <MapComponent
      mapRef={mapRef}
      onHover={onHover}
      handleClick={handleClick}
      layerIds={layerRef.current}
    >
      {!isPlaying && <Navbar />}
      {showEffect && (
        <>
          <div
            className={`border-effect-top-bar border-effect-color-${goodGuess.current}`}
          ></div>
          <div
            className={`border-effect-bottom-bar border-effect-color-${goodGuess.current}`}
          ></div>
          <div
            className={` border-effect-right-bar border-effect-color-${goodGuess.current}`}
          ></div>
          <div
            className={`border-effect-left-bar border-effect-color-${goodGuess.current}`}
          ></div>
        </>
      )}
      {playedCountryInfo.countryId === 0 && (
        <CountriesLayer hoverInfo={hoverInfo} />
      )}

      {playedCountryInfo.countryId !== 0 && (
        <CountryLayer
          gameOptions={gameOptions}
          userMarker={userMarker}
          userMarkerColor={userMarkerColor}
          answerMarker={answerMarker}
        />
      )}

      {playedCountryInfo.countryId !== 0 &&
        selectedElements.current.length > 0 && (
          <Round
            selectedElement={selectedElements.current.at(-1)}
            currentRound={currentRound.current}
            score={score.current}
            gameOptions={gameOptions}
            addedTime={addedTime.current}
            setEndGame={() => setEndGame()}
            showEndGameModal={showEndGameModal}
            setFinalScore={(time) => (score.current.time = time * 100)}
          />
        )}

      {gameOptions.gameMode === "5" &&
        (guessesCount.current === 0 || goodGuess.current) && (
          <div className="d-grid gap-2 col-6 mx-auto">
            <MDBBtn
              className="d-flex justify-content-center btn-next"
              onClick={() => setNewRound()}
            >
              {selectedElements.current.length !== 1 ? "Next" : "Finish"}
            </MDBBtn>
          </div>
        )}

      {showPopupInfo && popupInfo && playedCountryInfo.countryId === 0 && (
        <SelectedCountry
          popupInfo={popupInfo}
          handleOnClose={() => setPopupInfo(null)}
          handleOnPlay={handleOnPlay}
        />
      )}

      {showGameModal &&
        popupInfo &&
        selectedCountryNames.current.length > 0 && (
          <GameModal
            showGameModal={showGameModal}
            setShowGameModal={() => setShowGameModal(false)}
            handleNewGame={(values) => handleNewGame(values)}
            popupInfo={popupInfo}
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
