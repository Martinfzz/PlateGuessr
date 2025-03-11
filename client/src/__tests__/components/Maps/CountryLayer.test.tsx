import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import CountryLayer from "../../../components/Maps/CountryLayer";

const mockStore = configureStore([]);

jest.mock("react-map-gl", () => ({
  Source: jest.fn(({ children }) => (
    <div data-testid="countries-source">{children}</div>
  )),
  Layer: jest.fn((props) => (
    <div data-testid="countries-layer" data-props={JSON.stringify(props)} />
  )),
  Marker: jest.fn(({ children }) => <div data-testid="marker">{children}</div>),
}));

describe("CountryLayer Component", () => {
  const setup = (store: any) => {
    render(
      <Provider store={store}>
        <CountryLayer />
      </Provider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Source and Layer components", async () => {
    const generalStore = mockStore({
      game: {
        gameOptions: {
          someOption: true,
        },
        markers: {
          user: [{ longitude: 10, latitude: 50 }],
          answer: [{ longitude: 20, latitude: 40 }],
          color: "#000",
        },
      },
    });

    setup(generalStore);

    await waitFor(() => {
      expect(screen.getByTestId("countries-source")).toBeInTheDocument();
    });
    const layer = screen.getAllByTestId("countries-layer");
    expect(layer).toHaveLength(1);
    expect(layer[0]).toHaveAttribute("data-props");

    const markers = screen.getAllByTestId("marker");
    expect(markers).toHaveLength(2);
  });

  test("renders only user Marker component", () => {
    const userStore = mockStore({
      game: {
        gameOptions: {
          someOption: true,
        },
        markers: {
          user: [{ longitude: 10, latitude: 50 }],
          answer: [],
          color: "#000",
        },
      },
    });

    setup(userStore);

    const userMarker = screen.getAllByTestId("marker");
    expect(userMarker).toHaveLength(1);
    const userIcon = screen.getByTestId("user-marker-icon");
    expect(userIcon).toBeInTheDocument();
    expect(userIcon).toHaveStyle("color: #000");

    const answerIcon = screen.queryByTestId("answer-marker-icon");
    expect(answerIcon).not.toBeInTheDocument();
  });

  test("renders only answer Marker component", () => {
    const answerStore = mockStore({
      game: {
        gameOptions: {
          someOption: true,
        },
        markers: {
          user: [],
          answer: [{ longitude: 10, latitude: 50 }],
          color: "#000",
        },
      },
    });

    setup(answerStore);

    const answerMarker = screen.getAllByTestId("marker");
    expect(answerMarker).toHaveLength(1);
    const answerIcon = screen.getByTestId("answer-marker-icon");
    expect(answerIcon).toBeInTheDocument();
    expect(answerIcon).toHaveStyle("color: #47A025");

    const userIcon = screen.queryByTestId("user-marker-icon");
    expect(userIcon).not.toBeInTheDocument();
  });

  test("does not render user Markers when user made no guesses", () => {
    jest.clearAllMocks();

    const emptyStore = mockStore({
      game: {
        gameOptions: {
          someOption: true,
        },
        markers: {
          user: [],
          answer: [],
          color: "#000",
        },
      },
    });

    render(
      <Provider store={emptyStore}>
        <CountryLayer />
      </Provider>
    );
    const userMarkers = screen.queryAllByTestId("user-marker");
    expect(userMarkers).toHaveLength(0);
    const answerMarkers = screen.queryAllByTestId("answer-marker");
    expect(answerMarkers).toHaveLength(0);
  });
});
