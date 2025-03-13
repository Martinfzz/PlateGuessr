import gameReducer, {
  setGameOptions,
  setHoverInfo,
  setPopupInfo,
  setMarkers,
  setPlayedCountryInfo,
  setIsPlaying,
} from "../../../features/game/gameSlice";
import {
  GameOptions,
  HoverInfo,
  PopupInfo,
  PlayedCountryInfo,
} from "shared.types";

describe("gameSlice", () => {
  const initialState = {
    gameOptions: {
      toggleColors: true,
      toggleBorders: true,
      toggleLabels: true,
      color: "#fff",
      gameMode: "",
      numberOfRounds: 20,
    },
    hoverInfo: {
      longitude: null,
      latitude: null,
      countryId: null,
    },
    popupInfo: {
      longitude: null,
      latitude: null,
      zoom: null,
      countryId: null,
      name: "",
      color: "#fff",
    },
    markers: {
      user: [{ longitude: 0, latitude: 0 }],
      answer: [{ longitude: 0, latitude: 0 }],
      color: "#4A7B9D",
    },
    playedCountryInfo: { countryId: 0 },
    isPlaying: false,
  };

  test("should return the initial state", () => {
    expect(gameReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("should handle setGameOptions", () => {
    const gameOptions: GameOptions = {
      toggleColors: false,
      toggleBorders: false,
      toggleLabels: false,
      color: "#000",
      gameMode: "test",
      numberOfRounds: 10,
    };
    const actual = gameReducer(initialState, setGameOptions(gameOptions));
    expect(actual.gameOptions).toEqual(gameOptions);
  });

  test("should handle setHoverInfo", () => {
    const hoverInfo: HoverInfo = {
      countryId: 1,
      longitude: 10,
      latitude: 50,
    };
    const actual = gameReducer(initialState, setHoverInfo(hoverInfo));
    expect(actual.hoverInfo).toEqual(hoverInfo);
  });

  test("should handle setPopupInfo", () => {
    const popupInfo: PopupInfo = {
      longitude: 10,
      latitude: 50,
      zoom: 5,
      name: "testCountryName",
      countryId: 1,
      color: "#000",
    };
    const actual = gameReducer(initialState, setPopupInfo(popupInfo));
    expect(actual.popupInfo).toEqual(popupInfo);
  });

  test("should handle setMarkers", () => {
    const markers = {
      user: { longitude: 10, latitude: 50 },
      answer: { longitude: 20, latitude: 60 },
      color: "#000",
    };
    const actual = gameReducer(initialState, setMarkers(markers));
    expect(actual.markers.user).toEqual([markers.user]);
    expect(actual.markers.answer).toEqual([markers.answer]);
    expect(actual.markers.color).toEqual(markers.color);
  });

  test("should handle setPlayedCountryInfo", () => {
    const playedCountryInfo: PlayedCountryInfo = {
      countryId: 1,
    };
    const actual = gameReducer(
      initialState,
      setPlayedCountryInfo(playedCountryInfo)
    );
    expect(actual.playedCountryInfo).toEqual(playedCountryInfo);
  });

  test("should handle setIsPlaying", () => {
    const actual = gameReducer(initialState, setIsPlaying(true));
    expect(actual.isPlaying).toEqual(true);
  });
});
