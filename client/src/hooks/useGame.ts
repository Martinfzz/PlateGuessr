import {
  useState,
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
} from "react";
import {
  setGameOptions,
  setHoverInfo,
  setPopupInfo,
  setPlayedCountryInfo,
  setMarkers,
  setIsPlaying,
} from "../features/game/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import { GameOptions, PlayedCountryInfo, PopupInfo } from "shared.types";
import { MapRef } from "react-map-gl";

interface GameState {
  game: {
    gameOptions: GameOptions;
    popupInfo: PopupInfo;
    playedCountryInfo: PlayedCountryInfo;
  };
}

type Country = {
  id: string;
  name: string;
  lng: number;
  lat: number;
}[];

export const useGame = () => {
  const dispatch = useDispatch();
  const { gameOptions, popupInfo, playedCountryInfo } = useSelector(
    (state: GameState) => state.game
  );

  const [showPopupInfo, setShowPopupInfo] = useState<boolean>(false);
  const [showGameModal, setShowGameModal] = useState<boolean>(false);
  const [showEndGameModal, setShowEndGameModal] = useState<boolean>(false);
  const [showEffect, setShowEffect] = useState<boolean>(false);

  // Refs for mutable values
  const selectedElements = useRef<Country>([]);
  const selectedCountryNames = useRef<Country>([]);
  const layerRef = useRef<string>("countries");
  const mapRef = useRef<MapRef>(null);
  const score = useRef({ before: 0, after: 0, time: 0 });
  const currentRound = useRef<number>(1);
  const clickIsDisable = useRef<boolean>(false);
  const newRoundTimeout: MutableRefObject<NodeJS.Timeout | undefined> =
    useRef(undefined);
  const guessesCount = useRef<number>(3);
  const goodGuess = useRef<boolean>(false);
  const addedTime = useRef<number>(0);

  // Helper function to fetch features from the map
  const getFeatures = (e: any) => {
    const map = mapRef?.current?.getMap() || null;
    return map?.queryRenderedFeatures(e.point, {
      layers: [layerRef.current],
    });
  };

  // Handle hover on the map and set hoverInfo
  const onHover = async (e: { lngLat: { lng: number; lat: number } }) => {
    const features = await getFeatures(e);
    const country = features && features[0];
    dispatch(
      setHoverInfo({
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat,
        countryId: country && country?.properties?.ID,
      })
    );
  };

  const getRandomUniqueName = (names: Country, usedNames: Country) => {
    let name;
    do {
      name = names[Math.floor(Math.random() * names.length)];
    } while (usedNames.includes(name));
    return name;
  };

  // Select random names from the current country
  const selectRandomElements = async (n: number) => {
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
  const handleNewGame = async (values: GameOptions) => {
    dispatch(setIsPlaying(true));
    setShowGameModal(false);
    dispatch(setPlayedCountryInfo({ countryId: popupInfo.countryId ?? 0 }));
    await selectRandomElements(values.numberOfRounds);
    dispatch(setGameOptions(values));

    score.current = { before: 0, after: 0, time: 0 };
  };

  const toggleLayout = (status: "visible" | "none") => {
    const map = mapRef?.current?.getMap();
    map?.style.stylesheet.layers.forEach(function (layer) {
      if (layer.type === "symbol") {
        map.setLayoutProperty(layer.id, "visibility", status);
      }
    });
  };

  // Hide labels when the toggle is off
  useEffect(() => {
    if (!gameOptions.toggleLabels) toggleLayout("none");
  }, [gameOptions]);

  const resetMarkers = useCallback(() => {
    dispatch(
      setMarkers({
        user: { longitude: null, latitude: null },
        answer: { longitude: null, latitude: null },
      })
    );
    clickIsDisable.current = false; // Prevent multiple click before a new round
  }, [dispatch]);

  // Start a new round, resetting markers and check if game is over
  const setNewRound = useCallback(() => {
    resetMarkers();
    currentRound.current += 1;
    selectedElements.current.pop();
    guessesCount.current = 3;
    goodGuess.current = false;

    if (selectedElements.current.length <= 0) {
      setEndGame();
    }
  }, [resetMarkers]);

  const setEndGame = () => {
    clearTimeout(newRoundTimeout.current);
    score.current.after = Math.floor(score.current.after + score.current.time);
    setShowEndGameModal(true);
  };

  // Set user marker and check if the answer is correct
  const setMarkerCoords = useCallback(
    (e: any, features: any) => {
      dispatch(
        setMarkers({
          user: { longitude: e.lngLat.lng, latitude: e.lngLat.lat },
        })
      );
      setShowEffect(true);
      setTimeout(() => setShowEffect(false), 2000);

      if (
        features[0]?.properties.name === selectedElements.current.at(-1)?.id
      ) {
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
        const answerLongitude = selectedElements.current.at(-1)?.lng;
        const answerLatitude = selectedElements.current.at(-1)?.lat;
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
    [dispatch, gameOptions.gameMode, resetMarkers, setNewRound]
  );

  const handleClickOnCountry = useCallback(
    (features: any) => {
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
        dispatch(
          setPopupInfo({
            longitude: null,
            latitude: null,
            zoom: null,
            countryId: null,
            name: "",
            color: "#fff",
          })
        );
        setShowPopupInfo(false);
      }
    },
    [dispatch]
  );

  // Handle map click
  const handleClick = useCallback(
    async (e: any) => {
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
    [handleClickOnCountry, playedCountryInfo.countryId, setMarkerCoords]
  );

  // Handle visibility of map layers based on game options
  useEffect(() => {
    if (playedCountryInfo.countryId !== 0) {
      layerRef.current = "country";
      mapRef.current?.flyTo({
        center: [popupInfo.longitude ?? 0, popupInfo.latitude ?? 0],
        zoom: popupInfo.zoom ?? 5,
        duration: 2000,
      });
    } else {
      layerRef.current = "countries";
    }
  }, [playedCountryInfo, popupInfo]);

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
