import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";
import { ThemeContext } from "../Theme";
import { useAuthContext } from "../hooks/useAuthContext";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { useSearchParams } from "react-router-dom";

jest.mock("../components/Maps/MainLayout", () => {
  return () => <div>MainLayout Component</div>;
});

jest.mock("../hooks/useAuthContext", () => ({
  useAuthContext: jest.fn(),
}));

jest.mock("../hooks/useVerifyEmail", () => ({
  useVerifyEmail: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useSearchParams: jest.fn(),
}));

describe("App Component", () => {
  beforeEach(() => {
    (useAuthContext as jest.Mock).mockReturnValue({
      user: { isVerified: false },
    });
    (useVerifyEmail as jest.Mock).mockReturnValue({ verifyEmail: jest.fn() });
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams("emailToken=mock_token"),
    ]);
  });

  test("renders App component with MainLayout and Outlet", () => {
    render(
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: jest.fn() }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContext.Provider>
    );

    expect(screen.getByText("MainLayout Component")).toBeInTheDocument();
  });

  test("applies theme class to App component", () => {
    render(
      <ThemeContext.Provider
        value={{ theme: "dark-theme", toggleTheme: jest.fn() }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId("app-container")).toHaveClass("App dark-theme");
  });

  test("calls verifyEmail when emailToken is present and user is not verified", () => {
    const mockVerifyEmail = jest.fn();
    (useVerifyEmail as jest.Mock).mockReturnValue({
      verifyEmail: mockVerifyEmail,
    });
    render(
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: jest.fn() }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContext.Provider>
    );

    expect(mockVerifyEmail).toHaveBeenCalledWith("mock_token");
  });

  test("does not call verifyEmail when emailToken is not present", () => {
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams()]);
    const mockVerifyEmail = jest.fn();
    (useVerifyEmail as jest.Mock).mockReturnValue({
      verifyEmail: mockVerifyEmail,
    });
    render(
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: jest.fn() }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContext.Provider>
    );

    expect(mockVerifyEmail).not.toHaveBeenCalled();
  });

  test("does not call verifyEmail when user is verified", () => {
    (useAuthContext as jest.Mock).mockReturnValue({
      user: { isVerified: true },
    });
    const mockVerifyEmail = jest.fn();
    (useVerifyEmail as jest.Mock).mockReturnValue({
      verifyEmail: mockVerifyEmail,
    });
    render(
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: jest.fn() }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContext.Provider>
    );

    expect(mockVerifyEmail).not.toHaveBeenCalled();
  });
});
