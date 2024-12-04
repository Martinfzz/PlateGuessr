import { createSlice } from "@reduxjs/toolkit";

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
    user: [{ longitude: null, latitude: null }],
    answer: [{ longitude: null, latitude: null }],
    color: "#4A7B9D",
  },
  playedCountryInfo: { countryId: 0 },
  isPlaying: false,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameOptions: (state, action) => {
      state.gameOptions = action.payload;
    },
    setHoverInfo: (state, action) => {
      state.hoverInfo = action.payload;
    },
    setPopupInfo: (state, action) => {
      state.popupInfo = action.payload;
    },
    setPlayedCountryInfo: (state, action) => {
      state.playedCountryInfo = action.payload;
    },
    setMarkers: (state, action) => {
      Object.keys(action.payload).forEach(
        (key) =>
          (state.markers = {
            ...state.markers,
            [key]: [action.payload[key]],
          })
      );
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
  },
});

export const {
  setGameOptions,
  setHoverInfo,
  setPopupInfo,
  setPlayedCountryInfo,
  setMarkers,
  setIsPlaying,
} = gameSlice.actions;

export default gameSlice.reducer;
