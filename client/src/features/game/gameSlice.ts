import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  GameOptions,
  HoverInfo,
  Markers,
  PlayedCountryInfo,
  PopupInfo,
} from "shared.types";

interface GameState {
  gameOptions: GameOptions;
  hoverInfo: HoverInfo;
  popupInfo: PopupInfo;
  markers: Markers;
  playedCountryInfo: PlayedCountryInfo;
  isPlaying: boolean;
}

const initialState: GameState = {
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

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGameOptions: (state, action: PayloadAction<GameOptions>) => {
      state.gameOptions = action.payload;
    },
    setHoverInfo: (state, action: PayloadAction<HoverInfo>) => {
      state.hoverInfo = action.payload;
    },
    setPopupInfo: (state, action: PayloadAction<PopupInfo>) => {
      state.popupInfo = action.payload;
    },
    setPlayedCountryInfo: (state, action: PayloadAction<PlayedCountryInfo>) => {
      state.playedCountryInfo = action.payload;
    },
    setMarkers: (state, action) => {
      const { payload } = action;
      Object.keys(payload).forEach((key) => {
        if (key in state.markers) {
          (state.markers as any)[key] = [payload[key]];
        }
      });
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
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
