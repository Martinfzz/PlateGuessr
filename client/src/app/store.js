import { configureStore } from "@reduxjs/toolkit";
import mapViewport from "../features/map/mapSlice";

export default configureStore({
  reducer: {
    mapViewport: mapViewport,
  },
});
