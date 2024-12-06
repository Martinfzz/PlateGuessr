import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MapState } from "shared.types";

const initialState: MapState = {
  longitude: parseFloat(localStorage.getItem("lng") ?? "2"),
  latitude: parseFloat(localStorage.getItem("lat") ?? "46"),
  zoom: parseFloat(localStorage.getItem("zoom") ?? "5"),
};

export const mapSlice = createSlice({
  name: "mapViewport",
  initialState,
  reducers: {
    // Set viewport in local storage to get it even if the page is reloaded
    setViewport: (state = initialState, action: PayloadAction<MapState>) => {
      const { longitude, latitude, zoom } = action.payload;
      localStorage.setItem("lng", longitude.toString());
      localStorage.setItem("lat", latitude.toString());
      localStorage.setItem("zoom", zoom.toString());
      return {
        longitude: longitude,
        latitude: latitude,
        zoom: zoom,
      };
    },
  },
});

export const { setViewport } = mapSlice.actions;

export default mapSlice.reducer;
