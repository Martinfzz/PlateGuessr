import { useState, useCallback, useEffect, useRef } from "react";
import {
  setGameOptions,
  setHoverInfo,
  setPopupInfo,
  setPlayedCountryInfo,
  setMarkers,
  setIsPlaying,
} from "../features/game/gameSlice";
import { useDispatch, useSelector } from "react-redux";

const useGame = () => {
  const dispatch = useDispatch();
  const { gameOptions, popupInfo, playedCountryInfo } = useSelector(
    (state) => state.game
  );

  const [showPopupInfo, setShowPopupInfo] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showEndGameModal, setShowEndGameModal] = useState(false);
  const [showEffect, setShowEffect] = useState(false);

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
    dispatch(
      setHoverInfo({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        countryId: country && country.properties.ID,
      })
    );
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
    dispatch(setIsPlaying(true));
    setShowGameModal(false);
    dispatch(setPlayedCountryInfo(popupInfo));
    await selectRandomElements(values.numberOfRounds);
    dispatch(setGameOptions(values));

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
    dispatch(
      setMarkers({
        user: { longitude: null, latitude: null },
        answer: { longitude: null, latitude: null },
      })
    );
    clickIsDisable.current = false; // Prevent multiple click before a new round
  };

  // Set user marker and check if the answer is correct
  const setMarkerCoords = useCallback(
    (e, features) => {
      dispatch(
        setMarkers({
          user: { longitude: e.lngLat.lng, latitude: e.lngLat.lat },
        })
      );
      setShowEffect(true);
      setTimeout(() => setShowEffect(false), 2000);

      if (features[0]?.properties.name === selectedElements.current.at(-1).id) {
        dispatch(setMarkers({ color: "#47A025" }));
        score.current.before = score.current.after;
        score.current.after = score.current.after + guessesCount.current * 1000;
        goodGuess.current = true;
        addedTime.current = guessesCount.current * 5;
        clearTimeout(newRoundTimeout.current);
      } else {
        dispatch(setMarkers({ color: "#E3655B" }));
        guessesCount.current = guessesCount.current - 1;
      }

      if (guessesCount.current === 0) {
        const answerLongitude = selectedElements.current.at(-1).lng;
        const answerLatitude = selectedElements.current.at(-1).lat;
        dispatch(
          setMarkers({
            answer: { longitude: answerLongitude, latitude: answerLatitude },
          })
        );
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
      dispatch(
        setPopupInfo({
          longitude: country.properties.LNG,
          latitude: country.properties.LAT,
          zoom: country.properties.ZOOM,
          countryId: country.properties.ID,
          name: country.properties.ADMIN,
          color: country.properties.COLOR,
        })
      );
      setShowPopupInfo(true);
    } else {
      dispatch(setPopupInfo(null));
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
    const country = await import(
      `../assets/metadata/json/${popupInfo.name.toLowerCase()}.json`
    );
    setShowGameModal(true);
    setShowPopupInfo(false);
    selectedCountryNames.current = country.names;
  };

  // Handle when the user wants to go back to the main map
  const handleOnBack = () => {
    dispatch(setPlayedCountryInfo({ countryId: 0 }));
    setShowEndGameModal(false);
    dispatch(setIsPlaying(false));
    currentRound.current = 1;
    toggleLayout("visible");
  };

  // Handle when the user wants to play again
  const handleOnPlayAgain = () => {
    setShowEndGameModal(false);
    currentRound.current = 1;
    handleNewGame(gameOptions);
  };

  return {
    showPopupInfo,
    showGameModal,
    playedCountryInfo,
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
  };
};

export default useGame;
