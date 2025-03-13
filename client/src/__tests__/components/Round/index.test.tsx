import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Round from "../../../components/Round";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";

const mockStore = configureStore([]);
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Round Component", () => {
  const defaultProps = {
    selectedElement: {
      id: "TE",
      name: "Test Element",
    },
    currentRound: 1,
    score: {
      before: 50,
      after: 100,
      time: 120,
    },
    addedTime: 10,
    setEndGame: jest.fn(),
    showEndGameModal: false,
    setFinalScore: jest.fn(),
  };

  const navigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(navigate);

  describe("GameMode is not 5", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "1",
          numberOfRounds: 20,
        },
      },
    });

    const setup = () => {
      render(
        <Provider store={store}>
          <Router>
            <Round {...defaultProps} />
          </Router>
        </Provider>
      );
    };

    beforeEach(() => {
      setup();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("renders ProgressBar component", () => {
      expect(screen.getByTestId("progress-bar")).toBeInTheDocument();
    });

    test("renders Round component with correct props", () => {
      const backLink = screen.getByRole("link", {
        name: /app_common.go_back/i,
      });
      expect(backLink).toHaveAttribute("href", "/");

      expect(screen.getByText("TE")).toBeInTheDocument();
      expect(screen.getByText("game.round")).toBeInTheDocument();
      expect(screen.getByText("1 / 20")).toBeInTheDocument();
      expect(screen.getByText("game.score")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
    });

    test("renders ConfirmationModal when go back btn is clicked", () => {
      const backButton = screen.getByText("app_common.go_back");

      expect(
        screen.queryByText("pages.account.are_you_sure")
      ).not.toBeInTheDocument();

      fireEvent.click(backButton);

      expect(
        screen.getByText("pages.account.are_you_sure")
      ).toBeInTheDocument();
      expect(screen.getByText("game.loose_progression")).toBeInTheDocument();
    });

    test("should navigate to main page when go back btn is clicked", () => {
      const backButton = screen.getByText("app_common.go_back");
      fireEvent.click(backButton);

      const confirmButton = screen.getByText("app_common.confirm");
      fireEvent.click(confirmButton);

      expect(window.location.pathname).toBe("/");
    });
  });

  describe("GameMode is 5", () => {
    const store = mockStore({
      game: {
        gameOptions: {
          gameMode: "5",
          numberOfRounds: 20,
        },
      },
    });

    const setup = () => {
      render(
        <Provider store={store}>
          <Router>
            <Round {...defaultProps} />
          </Router>
        </Provider>
      );
    };

    beforeEach(() => {
      setup();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should not render ProgressBar component", () => {
      expect(screen.queryByTestId("progress-bar")).not.toBeInTheDocument();
    });

    test("renders Round component with correct props", () => {
      expect(screen.getByText("TE - Test Element")).toBeInTheDocument();
    });
  });
});
