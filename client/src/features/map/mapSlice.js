import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  longitude: localStorage.getItem("lng") ?? 2,
  latitude: localStorage.getItem("lat") ?? 46,
  zoom: localStorage.getItem("zoom") ?? 5,
};

export const mapSlice = createSlice({
  name: "mapViewport",
  initialState,
  reducers: {
    // Set viewport in local storage to get it even if the page is reloaded
    setViewport: (state = initialState, action) => {
      localStorage.setItem("lng", action.payload.longitude);
      localStorage.setItem("lat", action.payload.latitude);
      localStorage.setItem("zoom", action.payload.zoom);
      return {
        longitude: action.payload.longitude,
        latitude: action.payload.latitude,
        zoom: action.payload.zoom,
      };
    },
  },
});

export const { setViewport } = mapSlice.actions;

export default mapSlice.reducer;
