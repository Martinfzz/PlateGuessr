import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import MapComponent from "../../../components/Maps/MapComponent";
import { ThemeContext } from "../../../Theme";
import { MapRef } from "react-map-gl";

const mockStore = configureStore([]);

jest.mock("mapbox-gl", () => ({
  Map: jest.fn(),
}));

jest.mock("react-map-gl", () => ({
  __esModule: true,
  default: ({ children, onMove, ...props }: any) => {
    const handleMove = (e: any) => {
      if (onMove) {
        onMove({
          viewState: { longitude: -122.42, latitude: 37.78, zoom: 10 },
        });
      }
    };

    return (
      <div {...props} onMouseMove={handleMove} data-testid="map-component">
        {children}
      </div>
    );
  },
  FullscreenControl: () => <div>FullscreenControl</div>,
  NavigationControl: () => <div>NavigationControl</div>,
  ScaleControl: () => <div>ScaleControl</div>,
}));

describe("MapComponent", () => {
  let store: any = mockStore({
    mapViewport: {
      longitude: 0,
      latitude: 0,
      zoom: 2,
    },
  });
  let mapRef = {
    current: {
      getMap: jest.fn(),
    },
  } as unknown as React.MutableRefObject<MapRef>;
  const onHover = jest.fn();
  const handleClick = jest.fn();
  const handleViewportChange = jest.fn();
  let skipBeforeEach = false;

  const setup = (theme = "light-theme") => {
    render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme, toggleTheme: jest.fn() }}>
          <MapComponent
            mapRef={mapRef}
            onHover={onHover}
            handleClick={handleClick}
            layerId="layer-1"
          >
            <div>Test Child</div>
          </MapComponent>
        </ThemeContext.Provider>
      </Provider>
    );

    return { handleViewportChange };
  };

  beforeEach(() => {
    if (!skipBeforeEach) setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders MapComponent with children", () => {
    expect(screen.getByTestId("map-component")).toBeInTheDocument();

    expect(screen.getByText("Test Child")).toBeInTheDocument();
    expect(screen.getByText("FullscreenControl")).toBeInTheDocument();
    expect(screen.getByText("NavigationControl")).toBeInTheDocument();
    expect(screen.getByText("ScaleControl")).toBeInTheDocument();
  });

  test("should call handleClick when map is clicked", () => {
    fireEvent.click(screen.getByTestId("map-component"));

    expect(handleClick).toHaveBeenCalled();
  });

  // test("should call onHover when map is hovered", async () => {
  //   fireEvent.mouseMove(screen.getByTestId("map-component"));

  //   await waitFor(() => {
  //     expect(onHover).toHaveBeenCalled();
  //   });
  // });

  test("should change cursor when map is hovered", () => {
    fireEvent.mouseEnter(screen.getByTestId("map-component"));

    expect(screen.getByTestId("map-component")).toHaveAttribute(
      "cursor",
      "pointer"
    );

    fireEvent.mouseLeave(screen.getByTestId("map-component"));

    expect(screen.getByTestId("map-component")).not.toHaveAttribute("cursor");

    skipBeforeEach = true;
  });

  test("should have dark theme when theme is dark", () => {
    setup("dark-theme");

    expect(screen.getByTestId("map-component")).toHaveAttribute(
      "mapstyle",
      "mapbox://styles/mapbox/dark-v11"
    );

    skipBeforeEach = false;
  });

  test("should have light theme when theme is light", () => {
    expect(screen.getByTestId("map-component")).toHaveAttribute(
      "mapstyle",
      "mapbox://styles/mapbox/light-v11"
    );

    // skipBeforeEach = true;
  });

  // test("should handle viewport change", async () => {
  //   // const { handleViewportChange } = setup();

  //   const mapElement = screen.getByTestId("map-component");
  //   // fireEvent.mouseDown(mapElement, { clientX: 100, clientY: 100 });

  //   // Simuler le déplacement de la souris
  //   fireEvent.mouseMove(mapElement, { clientX: 150, clientY: 150 });

  //   // Simuler le relâchement du clic
  //   // fireEvent.mouseUp(mapElement);

  //   const onMove = jest.fn();

  //   // await waitFor(() => {
  //   // expect(handleViewportChange).toHaveBeenCalled();
  //   console.log(store.getActions());
  //   expect(store.getActions()).toEqual([
  //     {
  //       type: "mapViewport/setViewport",
  //       payload: {
  //         latitude: 37.78,
  //         longitude: -122.42,
  //         zoom: 10,
  //       },
  //     },
  //   ]);
  //   // });
  // });
});
