import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import GameModal from "../../../components/GameModal";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockStore = configureStore([]);
const store = mockStore({
  game: {
    popupInfo: {
      longitude: 0,
      latitude: 0,
      zoom: 0,
      countryId: 1,
      name: "test",
      color: "blue",
    },
  },
});

describe("GameModal", () => {
  const handleNewGame = jest.fn();
  const setShowGameModal = jest.fn();

  const setup = (showGameModal: boolean = true) => {
    render(
      <Provider store={store}>
        <Router>
          <GameModal
            showGameModal={showGameModal}
            setShowGameModal={setShowGameModal}
            handleNewGame={handleNewGame}
            selectedCountryNamesLength={50}
          />
        </Router>
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders GameModal", () => {
    setup();

    const img = screen.getByAltText("country flag");
    expect(img).toHaveAttribute("src", "/images/test.jpg");
    const link = screen.getByTestId("stats-link-id");
    expect(link).toHaveAttribute("href", "/country/1");
    expect(screen.getByText("pages.stats.stats")).toBeInTheDocument();
    expect(screen.getByText("game.country_description")).toBeInTheDocument();
    expect(screen.getByText("app_common.play")).toBeInTheDocument();
  });

  test("change formik values when game options change", () => {
    setup();

    expect(screen.getByLabelText("game.colors")).toBeInTheDocument();
    expect(screen.getByLabelText("game.borders")).toBeInTheDocument();
    expect(screen.getByLabelText("game.labels")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("game.colors"));
    fireEvent.click(screen.getByLabelText("game.borders"));
    fireEvent.click(screen.getByLabelText("game.labels"));

    expect(screen.getByLabelText("game.colors")).not.toBeChecked();
    expect(screen.getByLabelText("game.borders")).not.toBeChecked();
    expect(screen.getByLabelText("game.labels")).not.toBeChecked();
  });

  test("calls handleNewGame when form is submitted and valid", async () => {
    setup();

    fireEvent.change(screen.getByLabelText("Game Mode"), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("app_common.play"));

    await waitFor(() => {
      expect(handleNewGame).toHaveBeenCalledWith({
        gameMode: "1",
        numberOfRounds: 20,
        toggleColors: true,
        toggleBorders: true,
        toggleLabels: true,
        color: "blue",
      });
    });
  });

  test("when showGameModal is false", () => {
    setup(false);
    expect(screen.queryByText("app_common.play")).not.toBeInTheDocument();
  });

  describe("renders GameMode", () => {
    test("renders GameMode", () => {
      setup();

      expect(screen.getByText("game.game_mode.heading")).toBeInTheDocument();
    });

    test("should throw an error if no game mode is selected", async () => {
      setup();

      fireEvent.click(screen.getByText("app_common.play"));

      await waitFor(() => {
        expect(screen.getByText("validations.required")).toBeInTheDocument();
      });
    });

    test("game color switch is disabled when game mode is 2", () => {
      setup();

      fireEvent.change(screen.getByLabelText("Game Mode"), {
        target: { value: "2" },
      });

      expect(screen.getByLabelText("game.colors")).toBeDisabled();
      expect(screen.getByLabelText("game.borders")).toBeEnabled();
      expect(screen.getByLabelText("game.labels")).toBeEnabled();
    });

    test("game border and color switches are disabled when game mode is 3", () => {
      setup();

      fireEvent.change(screen.getByLabelText("Game Mode"), {
        target: { value: "3" },
      });

      expect(screen.getByLabelText("game.colors")).toBeDisabled();
      expect(screen.getByLabelText("game.borders")).toBeDisabled();
      expect(screen.getByLabelText("game.labels")).toBeEnabled();
    });

    test("all switches are disabled when game mode is 4", () => {
      setup();

      fireEvent.change(screen.getByLabelText("Game Mode"), {
        target: { value: "4" },
      });

      expect(screen.getByLabelText("game.colors")).toBeDisabled();
      expect(screen.getByLabelText("game.borders")).toBeDisabled();
      expect(screen.getByLabelText("game.labels")).toBeDisabled();
    });

    test("all switches are enable when game mode is 5", () => {
      setup();

      fireEvent.change(screen.getByLabelText("Game Mode"), {
        target: { value: "5" },
      });

      expect(screen.getByLabelText("game.colors")).toBeEnabled();
      expect(screen.getByLabelText("game.borders")).toBeEnabled();
      expect(screen.getByLabelText("game.labels")).toBeEnabled();
    });

    test("should display number of rounds range when game mode 5 is selected", () => {
      setup();

      fireEvent.change(screen.getByLabelText("Game Mode"), {
        target: { value: "5" },
      });

      expect(
        screen.getByLabelText("game.game_mode.nb_of_rounds")
      ).toBeInTheDocument();
    });

    test("should change number of rounds when game mode 5 is selected", async () => {
      setup();

      fireEvent.change(screen.getByLabelText("Game Mode"), {
        target: { value: "5" },
      });

      fireEvent.change(screen.getByLabelText("game.game_mode.nb_of_rounds"), {
        target: { value: "40" },
      });

      fireEvent.click(screen.getByText("app_common.play"));

      await waitFor(() => {
        expect(handleNewGame).toHaveBeenCalledWith({
          gameMode: "5",
          numberOfRounds: "40",
          toggleColors: true,
          toggleBorders: true,
          toggleLabels: true,
          color: "blue",
        });
      });
    });
  });
});
