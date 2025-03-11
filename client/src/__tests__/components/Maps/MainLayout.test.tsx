import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import MainLayout from "../../../components/Maps/MainLayout";
import { useGame } from "../../../hooks/useGame";
import { AuthContextProvider } from "../../../context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

interface InitialProps {
  layerRef: React.RefObject<string>;
  score: React.RefObject<{ before: number; after: number; time: number }>;
  selectedCountryNames: React.RefObject<string[]>;
  [key: string]: any;
}

const mockStore = configureStore([]);
const store = mockStore({
  game: {
    gameOptions: {
      gameMode: "1",
    },
    playedCountryInfo: {
      countryId: 0,
    },
    markers: {
      user: [{ longitude: 10, latitude: 50 }],
      answer: [{ longitude: 20, latitude: 40 }],
      color: "#000",
    },
    isPlaying: false,
    popupInfo: {
      color: "#000",
      name: "Test",
    },
  },
  mapViewport: {
    latitude: 0,
    longitude: 0,
    zoom: 0,
  },
});

jest.mock("../../../hooks/useGame", () => ({
  useGame: jest.fn(),
}));

jest.mock("react-map-gl", () => ({
  __esModule: true,
  Source: jest.fn(({ children }) => <div data-testid="source">{children}</div>),
  Layer: jest.fn((props) => (
    <div data-testid="layer" data-props={JSON.stringify(props)} />
  )),
  Marker: jest.fn(({ children }) => <div data-testid="marker">{children}</div>),
  Popup: jest.fn(),
  default: ({ children, ...props }: { children: React.ReactNode }) => (
    <div data-testid="map-component" {...props}>
      {children}
    </div>
  ),
  NavigationControl: () => <div>NavigationControl</div>,
  FullscreenControl: () => <div>FullscreenControl</div>,
  ScaleControl: () => <div>ScaleControl</div>,
}));

describe("MainLayout Component", () => {
  const setup = (store: any, useGameMockProps: any = {}) => {
    const initialProps = {
      layerRef: { current: "test" },
      score: { current: { before: 0, after: 0, time: 0 } },
      selectedCountryNames: { current: [] },
      selectedElements: { current: [] },
      guessesCount: { current: 0 },
      goodGuess: { current: false },
      onHover: jest.fn(),
      handleClick: jest.fn(),
      handleOnPlay: jest.fn(),
      handleOnBack: jest.fn(),
      handleNewGame: jest.fn(),
      handleOnPlayAgain: jest.fn(),
      setEndGame: jest.fn(),
      setNewRound: jest.fn(),
      setShowGameModal: jest.fn(),
      ...useGameMockProps,
    };

    const filteredProps = Object.keys(initialProps).reduce(
      (acc: Partial<InitialProps>, key: string) => {
        acc[key] = initialProps[key];
        return acc;
      },
      {}
    );

    (useGame as jest.Mock).mockReturnValue({
      ...filteredProps,
    });

    render(
      <AuthContextProvider>
        <Router>
          <Provider store={store}>
            <MainLayout />
          </Provider>
        </Router>
      </AuthContextProvider>
    );
  };

  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders MapComponent", () => {
    setup(store);

    expect(screen.getByTestId("map-component")).toBeInTheDocument();
  });

  test("renders Navbar if user is not playing", () => {
    setup(store);

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  test("does not render Navbar if user is playing", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "1",
        },
        playedCountryInfo: {
          countryId: 0,
        },
        markers: {
          user: [{ longitude: 10, latitude: 50 }],
          answer: [{ longitude: 20, latitude: 40 }],
          color: "#000",
        },
        isPlaying: true,
      },
      mapViewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
      },
    });

    setup(store);

    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });

  test("renders BorderEffect if showEffect is true", () => {
    const useGameMockProps = {
      showEffect: true,
    };
    setup(store, useGameMockProps);

    expect(screen.getByTestId("border-effect")).toBeInTheDocument();
  });

  test("does not render BorderEffect if showEffect is false", () => {
    const useGameMockProps = {
      showEffect: false,
    };
    setup(store, useGameMockProps);

    expect(screen.queryByTestId("border-effect")).not.toBeInTheDocument();
  });

  test("renders CountriesLayer if playedCountryInfo.countryId is 0", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "1",
        },
        playedCountryInfo: {
          countryId: 0,
        },
        markers: {
          user: [{ longitude: 10, latitude: 50 }],
          answer: [{ longitude: 20, latitude: 40 }],
          color: "#000",
        },
      },
      mapViewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
      },
    });

    setup(store);

    const layers = screen.getAllByTestId("layer");

    expect(layers).toHaveLength(2);
  });

  test("renders CountryLayer if playedCountryInfo.countryId is not 0", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "1",
        },
        playedCountryInfo: {
          countryId: 1,
        },
        markers: {
          user: [{ longitude: 10, latitude: 50 }],
          answer: [{ longitude: 20, latitude: 40 }],
          color: "#000",
        },
      },
      mapViewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
      },
    });

    setup(store);

    const layer = screen.getByTestId("layer");

    expect(layer).toBeInTheDocument();
  });

  test("renders Round if playedCountryInfo.countryId is not 0 and selectedElements length is greater than 0", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "1",
        },
        playedCountryInfo: {
          countryId: 1,
        },
        markers: {
          user: [{ longitude: 10, latitude: 50 }],
          answer: [{ longitude: 20, latitude: 40 }],
          color: "#000",
        },
      },
      mapViewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
      },
    });

    const useGameMockProps = {
      selectedElements: {
        current: [{ id: "1", name: "Test" }],
      },
      currentRound: { current: 1 },
      addedTime: { current: 0 },
    };

    setup(store, useGameMockProps);

    expect(screen.getByTestId("round")).toBeInTheDocument();
  });

  test("does not render Round if playedCountryInfo.countryId is 0", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "1",
        },
        playedCountryInfo: {
          countryId: 0,
        },
      },
      mapViewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
      },
    });

    setup(store);

    expect(screen.queryByTestId("round")).not.toBeInTheDocument();
  });

  test("does not render Round if selectedElements length is 0", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "1",
        },
        playedCountryInfo: {
          countryId: 1,
        },
        markers: {
          user: [{ longitude: 10, latitude: 50 }],
          answer: [{ longitude: 20, latitude: 40 }],
          color: "#000",
        },
      },
      mapViewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
      },
    });

    setup(store);

    expect(screen.queryByTestId("round")).not.toBeInTheDocument();
  });

  test("does not render training button when game mode is not 5", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "1",
        },
        playedCountryInfo: {
          countryId: 0,
        },
      },
      mapViewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
      },
    });

    setup(store);

    expect(screen.queryByTestId("game-button")).not.toBeInTheDocument();
  });

  describe("Training button", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "5",
        },
        playedCountryInfo: {
          countryId: 0,
        },
        markers: {
          user: [{ longitude: 10, latitude: 50 }],
          answer: [{ longitude: 20, latitude: 40 }],
          color: "#000",
        },
      },
      mapViewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
      },
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("renders game next button when game mode is 5", () => {
      const useGameMockProps = {
        guessesCount: { current: 0 },
        goodGuess: true,
      };
      setup(store, useGameMockProps);

      expect(screen.getByTestId("game-button")).toBeInTheDocument();
    });

    test("does not render game next button when guessesCount is not 0 and good guess is false", () => {
      const useGameMockProps = {
        guessesCount: { current: 1 },
        goodGuess: false,
      };
      setup(store, useGameMockProps);

      expect(screen.queryByTestId("game-button")).not.toBeInTheDocument();
    });

    test("does not render game next button when goodGuess is true and guessesCount is not 0", () => {
      const useGameMockProps = {
        guessesCount: { current: 1 },
        goodGuess: true,
      };
      setup(store, useGameMockProps);

      expect(screen.queryByTestId("game-button")).not.toBeInTheDocument();
    });

    test("calls setNewRound when game next button is clicked", () => {
      const setNewRound = jest.fn();

      const useGameMockProps = {
        guessesCount: { current: 0 },
        goodGuess: true,
        setNewRound,
      };
      setup(store, useGameMockProps);

      const button = screen.getByTestId("game-button");
      expect(button).toBeInTheDocument();

      const btn = screen.getByText("app_common.next");

      fireEvent.click(btn);

      expect(setNewRound).toHaveBeenCalled();
    });

    test("display next text when selectedElements length is not 1", () => {
      const useGameMockProps = {
        guessesCount: { current: 0 },
        goodGuess: true,
        selectedElements: {
          current: [
            { id: "1", name: "Test" },
            { id: "2", name: "Test2" },
          ],
        },
      };
      setup(store, useGameMockProps);

      expect(screen.getByText("app_common.next")).toBeInTheDocument();
    });

    test("display finish text when selectedElements length is 1", () => {
      const useGameMockProps = {
        guessesCount: { current: 0 },
        goodGuess: true,
        selectedElements: { current: [{ id: "1", name: "Test" }] },
      };
      setup(store, useGameMockProps);

      expect(screen.getByText("app_common.finish")).toBeInTheDocument();
    });
  });

  test("does not render SelectedCountry if showPopupInfo is false and playedCountryInfo.countryId is not 0", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "5",
        },
        playedCountryInfo: {
          countryId: 1,
        },
        markers: {
          user: [{ longitude: 10, latitude: 50 }],
          answer: [{ longitude: 20, latitude: 40 }],
          color: "#000",
        },
      },
      mapViewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
      },
    });
    setup(store);

    expect(screen.queryByTestId("selected-country")).not.toBeInTheDocument();
  });

  test("renders SelectedCountry if showPopupInfo is true and playedCountryInfo.countryId is 0", () => {
    const useGameMockProps = {
      showPopupInfo: true,
    };
    setup(store, useGameMockProps);

    expect(screen.getByTestId("selected-country")).toBeInTheDocument();
  });

  test("renders GameModal if showGameModal is true and selectedCountryNames length is greater than 0", () => {
    const useGameMockProps = {
      showGameModal: true,
      selectedCountryNames: { current: ["Test"] },
    };
    setup(store, useGameMockProps);

    expect(screen.getByTestId("game-modal")).toBeInTheDocument();
  });

  test("does not render GameModal if showGameModal is false", () => {
    const useGameMockProps = {
      showGameModal: false,
    };
    setup(store, useGameMockProps);

    expect(screen.queryByTestId("game-modal")).not.toBeInTheDocument();
  });

  test("does not render GameModal if selectedCountryNames length is 0", () => {
    const useGameMockProps = {
      showGameModal: true,
    };
    setup(store, useGameMockProps);

    expect(screen.queryByTestId("game-modal")).not.toBeInTheDocument();
  });

  test("renders EndGameModal if showEndGameModal is true", () => {
    const useGameMockProps = {
      showEndGameModal: true,
    };
    setup(store, useGameMockProps);

    expect(screen.getByTestId("end-game-modal")).toBeInTheDocument();
  });

  test("does not render EndGameModal if showEndGameModal is false", () => {
    const useGameMockProps = {
      showEndGameModal: false,
    };
    setup(store, useGameMockProps);

    expect(screen.queryByTestId("end-game-modal")).not.toBeInTheDocument();
  });
});
