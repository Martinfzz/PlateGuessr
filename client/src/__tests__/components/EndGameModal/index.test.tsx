import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import EndGameModal from "../../../components/EndGameModal";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { AuthContext } from "../../../context/AuthContext";
import { API } from "../../../shared/helpers";
import { User } from "shared.types";

const mockStore = configureStore([]);
const store = mockStore({
  game: {
    gameOptions: {
      gameMode: "1",
    },
    playedCountryInfo: {
      countryId: "1",
    },
  },
});

jest.mock("../../../shared/helpers", () => ({
  ...jest.requireActual("../../../shared/helpers"),
  API: {
    post: jest.fn(() => Promise.resolve({})),
    get: jest.fn(() => Promise.resolve({ data: { best_score: 200 } })),
  },
}));

describe("EndGameModal Component", () => {
  const handleOnBack = jest.fn();
  const handleOnPlayAgain = jest.fn();
  const dispatch = jest.fn();

  const defaultScore = {
    before: 50,
    after: 100,
    time: 120,
  };

  const user = {
    id: "1",
    username: "test",
    email: "test@example.com",
    token: "token123",
    isVerified: true,
    authSource: "self",
  } as User;

  const setup = (
    userState: User | null = user,
    showEndGameModal: boolean = true,
    score: { before: number; after: number; time: number } = defaultScore
  ) => {
    const state = { user: userState };

    render(
      <AuthContext.Provider value={{ ...state, dispatch }}>
        <Provider store={store}>
          <Router>
            <EndGameModal
              score={score}
              showEndGameModal={showEndGameModal}
              handleOnBack={handleOnBack}
              handleOnPlayAgain={handleOnPlayAgain}
            />
          </Router>
        </Provider>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when showEndGameModal is true", () => {
    beforeEach(() => {
      setup();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test("renders modal with score and buttons", () => {
      expect(screen.getByText("game.final_score: 100")).toBeInTheDocument();
      expect(screen.getByText("game.play_again")).toBeInTheDocument();
      expect(screen.getByText("app_common.back")).toBeInTheDocument();
      expect(screen.getByText("pages.stats.see_stats")).toBeInTheDocument();
      const link = screen.getByRole("link", { name: /pages.stats.see_stats/i });
      expect(link).toHaveAttribute("href", "/country/1");
    });

    test("calls handleOnPlayAgain when Play Again button is clicked", () => {
      fireEvent.click(screen.getByText("game.play_again"));
      expect(handleOnPlayAgain).toHaveBeenCalled();
    });

    test("calls handleOnBack when Back button is clicked", () => {
      fireEvent.click(screen.getByText("app_common.back"));
      expect(handleOnBack).toHaveBeenCalled();
    });
  });

  describe("when showEndGameModal is false", () => {
    test("does not render modal when showEndGameModal is false", () => {
      setup(user, false);

      expect(screen.queryByText("game.play_again")).not.toBeInTheDocument();
    });
  });

  describe("when user is not authenticated", () => {
    test("display text and signup button", () => {
      setup(null);

      expect(
        screen.getByText("game.end_game.no_connected")
      ).toBeInTheDocument();
      expect(
        screen.getByText("game.end_game.cant_save_score")
      ).toBeInTheDocument();
      expect(screen.getByText("game.end_game.save_score")).toBeInTheDocument();
      const link = screen.getByRole("link", { name: /app_common.signup/i });
      expect(link).toHaveAttribute("href", "/signup");
    });
  });

  describe("when user is authenticated", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("when user do not beats their best score", () => {
      test("display previous best score text", async () => {
        setup();

        await waitFor(() => {
          expect(
            screen.getByText("game.end_game.no_score_beaten")
          ).toBeInTheDocument();
        });
        expect(screen.getByText("game.final_score: 100")).toBeInTheDocument();
        expect(
          screen.getByText("game.end_game.your_best_score 200")
        ).toBeInTheDocument();
      });
    });

    describe("when user beats their best score", () => {
      test("display best score text", async () => {
        const score = {
          before: 50,
          after: 300,
          time: 120,
        };

        setup(user, true, score);

        await waitFor(() => {
          expect(
            screen.getByText("game.end_game.best_score")
          ).toBeInTheDocument();
        });
        expect(screen.getByText("game.final_score: 300")).toBeInTheDocument();
      });
    });

    test("renders loading spinner when loading", () => {
      setup();

      expect(screen.getByTestId("custom-spinner")).toBeInTheDocument();
    });

    test("renders error message when API call fails", async () => {
      const mockedPost = API.post as jest.MockedFunction<typeof API.post>;
      mockedPost.mockRejectedValueOnce(new Error("API Error"));

      const mockedGet = API.get as jest.MockedFunction<typeof API.get>;
      mockedGet.mockRejectedValueOnce(new Error("API Error"));

      setup();

      jest.spyOn(console, "log").mockImplementation(() => {});
      await waitFor(() => {
        expect(console.log).toHaveBeenCalledTimes(2);
      });
    });

    test("Api endpoints are called correctly", async () => {
      const mockedPost = API.post as jest.MockedFunction<typeof API.post>;
      const mockedGet = API.get as jest.MockedFunction<typeof API.get>;

      setup();

      await waitFor(() => {
        expect(mockedPost).toHaveBeenCalledWith(
          `${process.env.REACT_APP_API_URL}/api/country/save_score?token=${user.token}&countryId=1&gameModeId=1&score=100`
        );
      });
      expect(mockedGet).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/score/country/game_mode/user?token=${user.token}&countryId=1&gameModeId=1`
      );
    });
  });
});
