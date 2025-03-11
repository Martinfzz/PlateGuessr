import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import { User } from "../../../shared.types";
import { AuthContext } from "../../../context/AuthContext";
import { useLogout } from "../../../hooks/useLogout";

jest.mock("../../../hooks/useLogout");

describe("Navbar Component", () => {
  const dispatch = jest.fn();
  const mockLogout = jest.fn();
  (useLogout as jest.Mock).mockReturnValue({ logout: mockLogout });

  const user = {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    token: "token123",
  };

  const setup = (
    userState: User | null = user,
    page: string = "",
    logo: boolean = true
  ) => {
    const state = { user: userState };

    render(
      <AuthContext.Provider value={{ ...state, dispatch }}>
        <Router>
          <Navbar page={page} logo={logo} />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Navbar component with logo", () => {
    setup(user, "", true);

    expect(screen.getByTestId("logo-id")).toBeInTheDocument();
  });

  test("renders Navbar component without logo", () => {
    setup(user, "", false);

    expect(screen.queryByTestId("logo-id")).not.toBeInTheDocument();
  });

  test("renders page badge with correct text", () => {
    setup(user, "testpage");

    const backButton = screen.getByRole("link", {
      name: /app_common.go_back/i,
    });
    expect(backButton).toHaveAttribute("href", "/");

    expect(screen.getByText("testpage")).toBeInTheDocument();
  });

  test("renders ConnexionBtn when user is not logged in", () => {
    setup(null);

    expect(screen.getByText("app_common.login")).toBeInTheDocument();
    expect(screen.getByText("app_common.signup")).toBeInTheDocument();
    expect(screen.queryByText("app_common.logout")).not.toBeInTheDocument();
  });

  test("renders ThemeToggleButton and LanguageSelector", () => {
    setup();

    expect(screen.getByTestId("theme-toggle-button")).toBeInTheDocument();
    expect(screen.getByTestId("language-selector")).toBeInTheDocument();
  });

  test("renders user dropdown when user is logged in", () => {
    setup();

    expect(screen.getByText("testuser")).toBeInTheDocument();

    fireEvent.click(screen.getByText("testuser"));

    const accountLink = screen.getAllByRole("link", {
      name: /pages.account.heading/i,
    });
    expect(accountLink[0]).toHaveAttribute("href", "/me/settings");

    const statsLink = screen.getAllByRole("link", {
      name: /pages.stats.my_stats/i,
    });
    expect(statsLink[0]).toHaveAttribute("href", "/user/1");

    const logoutButton = screen.getByText("app_common.logout");
    expect(logoutButton).toBeInTheDocument();
  });

  test("calls logout function when logout button is clicked", () => {
    setup();

    fireEvent.click(screen.getByText("testuser"));

    const logoutButton = screen.getByText("app_common.logout");

    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});
