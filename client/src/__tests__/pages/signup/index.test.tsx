import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import SignUp from "../../../pages/signup";
import { AuthContext } from "../../../context/AuthContext";
import { ThemeContext } from "../../../Theme";

describe("Account Component", () => {
  const toggleTheme = jest.fn();
  let setupTheme = "dark-theme";

  const setup = (theme: string) => {
    render(
      <AuthContext.Provider value={{ user: null, dispatch: jest.fn() }}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <Router>
            <SignUp />
          </Router>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    setup(setupTheme);
  });

  test("renders Logo", () => {
    const logo = screen.getByTestId("logo-id");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass("logo-container");
  });

  test("renders headers", () => {
    expect(screen.getByText("pages.signup.title_1")).toBeInTheDocument();
    expect(screen.getByText("pages.signup.title_2")).toBeInTheDocument();
  });

  test("should have a Google button", () => {
    expect(screen.getByText("pages.login.google")).toBeInTheDocument();
  });

  test("should have a dark-theme Apple button", () => {
    expect(screen.getByText("pages.login.apple")).toBeInTheDocument();
    expect(screen.getByTestId("apple-button")).toHaveClass("btn-light");
    setupTheme = "light-theme";
  });

  test("should have a light-theme Apple button", async () => {
    await expect(screen.getByText("pages.login.apple")).toBeInTheDocument();
    expect(screen.getByTestId("apple-button")).toHaveClass("btn-dark");
  });

  test("should have a Facebook button", () => {
    expect(screen.getByText("pages.login.facebook")).toBeInTheDocument();
  });

  test("should have a light-theme email button", () => {
    expect(screen.getByText("pages.signup.email")).toBeInTheDocument();
    expect(screen.getByTestId("email-button")).toHaveClass("btn-outline-dark");
    setupTheme = "dark-theme";
  });

  test("should have a dark-theme email button", async () => {
    await expect(screen.getByText("pages.signup.email")).toBeInTheDocument();
    expect(screen.getByTestId("email-button")).toHaveClass("btn-outline-light");
  });

  test("should have a login link", () => {
    const loginLink = screen.getByText("pages.signup.account");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  test("should open email modal", async () => {
    expect(
      screen.queryByText("pages.signup.modal_title_1")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("pages.signup.email"));

    expect(screen.getByText("pages.signup.modal_title_1")).toBeInTheDocument();
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });
});
