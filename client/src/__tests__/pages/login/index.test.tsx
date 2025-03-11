import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import LogIn from "../../../pages/login";
import { useLogin } from "../../../hooks/useLogin";

jest.mock("../../../hooks/useLogin", () => ({
  useLogin: jest.fn(),
}));

describe("Account Component", () => {
  const mockLogin = jest.fn();
  let skipBeforeEach = false;

  const setup = () => {
    render(
      <Router>
        <LogIn />
      </Router>
    );
  };

  beforeEach(() => {
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });
    if (!skipBeforeEach) setup();
  });

  test("renders Logo", () => {
    const logo = screen.getByTestId("logo-id");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass("logo-container");
  });

  test("renders EmailForm component", () => {
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  test("should have a divider", () => {
    expect(screen.getByText("pages.login.continue")).toBeInTheDocument();
  });

  test("should have a Google button", () => {
    expect(screen.getByText("pages.login.google")).toBeInTheDocument();
  });

  test("should have a Apple button", () => {
    expect(screen.getByText("pages.login.apple")).toBeInTheDocument();
  });

  test("should have a Facebook button", () => {
    expect(screen.getByText("pages.login.facebook")).toBeInTheDocument();
  });

  test("should have a create account link", () => {
    const createAccountLink = screen.getByText("pages.login.create_account");
    expect(createAccountLink).toBeInTheDocument();
    expect(createAccountLink).toHaveAttribute("href", "/signup");
  });

  test("should call login function when form is submitted", async () => {
    fireEvent.change(screen.getByLabelText("app_common.email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("app_common.password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("app_common.login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password");
    });
  });

  test("should not display Alert component when error is present", () => {
    expect(screen.queryByText("pages.login.failed")).not.toBeInTheDocument();
  });

  test("should display Alert component when error is present", () => {
    skipBeforeEach = true;
    (useLogin as jest.Mock).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: "Error",
    });

    setup();

    expect(screen.getByText("pages.login.failed")).toBeInTheDocument();
  });
});
