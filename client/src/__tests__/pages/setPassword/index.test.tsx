import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SetPassword from "../../../pages/setPassword";
import { ThemeContext } from "../../../Theme";
import { AuthContext } from "../../../context/AuthContext";
import { useSetPassword } from "../../../hooks/useSetPassword";
import { useParams } from "react-router-dom";

jest.mock("../../../hooks/useSetPassword", () => ({
  useSetPassword: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("SetPassword Component", () => {
  const mockSetPassword = jest.fn();
  const mockUseParams = useParams as jest.Mock;
  const mockUseSetPassword = useSetPassword as jest.Mock;

  beforeEach(() => {
    mockUseParams.mockReturnValue({ token: "test-token" });
    mockUseSetPassword.mockReturnValue({
      setPassword: mockSetPassword,
      error: null,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (theme: string) => {
    render(
      <AuthContext.Provider value={{ user: null, dispatch: jest.fn() }}>
        <ThemeContext.Provider value={{ theme, toggleTheme: jest.fn() }}>
          <BrowserRouter>
            <SetPassword />
          </BrowserRouter>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    );
  };

  test("renders the SetPassword component", () => {
    renderComponent("light-theme");

    expect(screen.getByText("pages.set_password.heading")).toBeInTheDocument();
    expect(
      screen.getByLabelText("pages.set_password.new_password")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("pages.set_password.repeat_password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "pages.reset_password.heading" })
    ).toBeInTheDocument();
  });

  test("submits the form with valid data", async () => {
    renderComponent("light-theme");

    const passwordInput = screen.getByLabelText(
      "pages.set_password.new_password"
    );
    const passwordConfirmationInput = screen.getByLabelText(
      "pages.set_password.repeat_password"
    );
    const submitButton = screen.getByRole("button", {
      name: "pages.reset_password.heading",
    });

    fireEvent.change(passwordInput, { target: { value: "Password123*" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "Password123*" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetPassword).toHaveBeenCalledWith(
        "Password123*",
        "Password123*",
        "test-token"
      );
    });
  });

  test("should call setPassword with empty token if not provided", async () => {
    mockUseParams.mockReturnValue({ token: "" });

    renderComponent("light-theme");

    const passwordInput = screen.getByLabelText(
      "pages.set_password.new_password"
    );
    const passwordConfirmationInput = screen.getByLabelText(
      "pages.set_password.repeat_password"
    );
    const submitButton = screen.getByRole("button", {
      name: "pages.reset_password.heading",
    });

    fireEvent.change(passwordInput, { target: { value: "Password123*" } });
    fireEvent.change(passwordConfirmationInput, {
      target: { value: "Password123*" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetPassword).toHaveBeenCalledWith(
        "Password123*",
        "Password123*",
        ""
      );
    });
  });

  test("shows validation errors for invalid data", async () => {
    renderComponent("light-theme");

    const submitButton = screen.getByRole("button", {
      name: "pages.reset_password.heading",
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByText("validations.required")).toHaveLength(2);
    });
  });

  test("displays an error message when there is an error", () => {
    mockUseSetPassword.mockReturnValueOnce({
      setPassword: mockSetPassword,
      error: "error_message_key",
      isLoading: false,
    });

    renderComponent("light-theme");

    expect(screen.getByText("error_message_key")).toBeInTheDocument();
  });

  test("shows a loading spinner when isLoading is true", () => {
    mockUseSetPassword.mockReturnValueOnce({
      setPassword: mockSetPassword,
      error: null,
      isLoading: true,
    });

    renderComponent("light-theme");

    expect(screen.getByTestId("custom-spinner")).toBeInTheDocument();
  });
});
