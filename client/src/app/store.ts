import { configureStore } from "@reduxjs/toolkit";
import mapViewport from "../features/map/mapSlice";
import game from "../features/game/gameSlice";

export default configureStore({
  reducer: {
    mapViewport: mapViewport,
    game: game,
  },
});
