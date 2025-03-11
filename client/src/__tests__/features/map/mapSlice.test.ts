import mapReducer, { setViewport } from "../../../features/map/mapSlice";
import { configureStore } from "@reduxjs/toolkit";

describe("mapSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should initialize with default values if localStorage is empty", () => {
    Storage.prototype.getItem = jest.fn().mockReturnValueOnce(null);

    const store = configureStore({
      reducer: {
        mapViewport: mapReducer,
      },
    });

    const state = store.getState().mapViewport;
    expect(state.longitude).toBe(2);
    expect(state.latitude).toBe(46);
    expect(state.zoom).toBe(5);
  });

  test("should update the state and localStorage when setViewport is dispatched", () => {
    const store = configureStore({
      reducer: {
        mapViewport: mapReducer,
      },
    });

    store.dispatch(setViewport({ longitude: 15, latitude: 30, zoom: 10 }));

    const state = store.getState().mapViewport;
    expect(state.longitude).toBe(15);
    expect(state.latitude).toBe(30);
    expect(state.zoom).toBe(10);
  });
});
