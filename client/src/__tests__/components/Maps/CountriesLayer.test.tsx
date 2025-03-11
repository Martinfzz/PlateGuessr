import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import CountriesLayer from "../../../components/Maps/CountriesLayer";
import { Layer } from "react-map-gl";

const mockStore = configureStore([]);
const store = mockStore({
  game: {
    hoverInfo: {
      countryId: "testCountryId",
    },
  },
});

jest.mock("react-map-gl", () => ({
  Source: jest.fn(({ children }) => (
    <div data-testid="countries-source">{children}</div>
  )),
  Layer: jest.fn(({ filter }) => (
    <div
      data-testid="countries-layer"
      data-filter={filter ? JSON.stringify(filter) : null}
    />
  )),
}));

describe("CountriesLayer Component", () => {
  const setup = () => {
    render(
      <Provider store={store}>
        <CountriesLayer />
      </Provider>
    );
  };

  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders Source and Layer components", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("countries-source")).toBeInTheDocument();
    });
    const layers = screen.getAllByTestId("countries-layer");
    expect(layers).toHaveLength(2);
    expect(Layer).toHaveBeenCalledTimes(2);
    expect(layers[0].getAttribute("data-filter")).toBeNull();
    expect(layers[1].getAttribute("data-filter")).toContain("testCountryId");
  });

  test("applies the correct filter based on hoverInfo", () => {
    expect(Layer).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: ["in", "ID", "testCountryId"],
      }),
      {}
    );
  });

  test("renders the highlight layer with a null filter", () => {
    const emptyStore = mockStore({
      game: {
        hoverInfo: {
          countryId: "",
        },
      },
    });

    render(
      <Provider store={emptyStore}>
        <CountriesLayer />
      </Provider>
    );

    expect(Layer).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: ["in", "ID", ""],
      }),
      {}
    );
  });
});
