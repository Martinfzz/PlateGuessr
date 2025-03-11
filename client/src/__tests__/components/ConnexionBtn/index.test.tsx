import React from "react";
import { render, screen } from "@testing-library/react";
import ConnexionBtn from "../../../components/ConnexionBtn";
import { BrowserRouter as Router } from "react-router-dom";

describe("ConnexionBtn Component", () => {
  test("renders login and signup buttons with correct text", () => {
    render(
      <Router>
        <ConnexionBtn />
      </Router>
    );

    expect(screen.getByText("app_common.login")).toBeInTheDocument();
    expect(screen.getByText("app_common.signup")).toBeInTheDocument();
  });

  test("renders login button with correct link", () => {
    render(
      <Router>
        <ConnexionBtn />
      </Router>
    );

    const loginButton = screen.getByText("app_common.login");
    expect(loginButton).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /app_common.login/i });
    expect(link).toHaveAttribute("href", "/login");
  });

  test("renders signup button with correct link", () => {
    render(
      <Router>
        <ConnexionBtn />
      </Router>
    );

    const signupButton = screen.getByText("app_common.signup");
    expect(signupButton).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /app_common.signup/i });
    expect(link).toHaveAttribute("href", "/signup");
  });
});
