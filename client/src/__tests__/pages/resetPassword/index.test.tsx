import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeContext } from "../../../Theme";
import { AuthContext } from "../../../context/AuthContext";
import ResetPassword from "../../../pages/resetPassword";
import { useResetPassword } from "../../../hooks/useResetPassword";

jest.mock("../../../hooks/useResetPassword", () => ({
  useResetPassword: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("ResetPassword Component", () => {
  const mockResetPassword = jest.fn();
  const mockUseResetPassword = useResetPassword as jest.Mock;

  const renderComponent = (theme: string) => {
    render(
      <AuthContext.Provider value={{ user: null, dispatch: jest.fn() }}>
        <ThemeContext.Provider value={{ theme, toggleTheme: jest.fn() }}>
          <BrowserRouter>
            <ResetPassword />
          </BrowserRouter>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    mockUseResetPassword.mockReturnValue({
      resetPassword: mockResetPassword,
      success: false,
      error: null,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders ResetPassword component", () => {
    renderComponent("light-theme");

    expect(screen.getByLabelText("app_common.email")).toBeInTheDocument();
    expect(screen.getAllByText("pages.reset_password.heading")).toHaveLength(2);
    expect(screen.getByTestId("connexion-btn")).toBeInTheDocument();
  });

  test("renders Navbar component", () => {
    renderComponent("light-theme");

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  test("submits the form with valid data", async () => {
    renderComponent("light-theme");

    const emailInput = screen.getByLabelText("app_common.email");
    const submitButton = screen.getByRole("button", {
      name: "pages.reset_password.heading",
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith("test@example.com");
    });
  });

  test("shows validation errors for invalid data", async () => {
    renderComponent("light-theme");

    const submitButton = screen.getByRole("button", {
      name: "pages.reset_password.heading",
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("validations.required")).toBeInTheDocument();
    });
  });

  test("displays an error message when there is an error", () => {
    mockUseResetPassword.mockReturnValueOnce({
      resetPassword: mockResetPassword,
      error: "error_message_key",
      isLoading: false,
    });

    renderComponent("light-theme");

    expect(screen.getByText("error_message_key")).toBeInTheDocument();
  });

  test("shows a loading spinner when isLoading is true", () => {
    mockUseResetPassword.mockReturnValueOnce({
      resetPassword: mockResetPassword,
      success: false,
      error: null,
      isLoading: true,
    });

    renderComponent("light-theme");

    expect(screen.getByTestId("custom-spinner")).toBeInTheDocument();
  });

  test("shows a success message when the password is reset and hide form", () => {
    mockUseResetPassword.mockReturnValueOnce({
      resetPassword: mockResetPassword,
      success: true,
      error: null,
      isLoading: false,
    });

    renderComponent("light-theme");

    expect(
      screen.getByText("pages.reset_password.success.title")
    ).toBeInTheDocument();
    expect(
      screen.getByText("pages.reset_password.success.message")
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("app_common.email")).not.toBeInTheDocument();
  });
});
