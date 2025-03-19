import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import LogIn from "../../../pages/login";
import { useLogin } from "../../../hooks/useLogin";
import { AuthContext } from "../../../context/AuthContext";
import { ThemeContext } from "../../../Theme";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import { useResendVerificationEmail } from "../../../hooks/useResendVerificationEmail";

jest.mock("../../../hooks/useGoogleAuth", () => ({
  useGoogleAuth: jest.fn(),
}));

jest.mock("../../../hooks/useResendVerificationEmail", () => ({
  useResendVerificationEmail: jest.fn(),
}));

jest.mock("@react-oauth/google", () => ({
  useGoogleLogin: jest.fn(),

  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock("../../../hooks/useLogin", () => ({
  useLogin: jest.fn(),
}));

describe("Account Component", () => {
  const mockLogin = jest.fn();
  const mockResendVerificationEmail = jest.fn();
  const toggleTheme = jest.fn();
  const mockGoogleLogin = jest.fn();
  const mockGoogleAuth = jest.fn();
  let skipBeforeEach = false;

  const setup = (theme: string = "light-theme") => {
    render(
      <GoogleOAuthProvider clientId={"123"}>
        <AuthContext.Provider value={{ user: null, dispatch: jest.fn() }}>
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Router>
              <LogIn />
            </Router>
          </ThemeContext.Provider>
        </AuthContext.Provider>
      </GoogleOAuthProvider>
    );
  };

  describe("Main component", () => {
    beforeEach(() => {
      (useLogin as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: null,
      });
      (useGoogleAuth as jest.Mock).mockReturnValue({
        googleAuth: mockGoogleAuth,
      });
      (useResendVerificationEmail as jest.Mock).mockReturnValue({
        resendVerificationEmail: mockResendVerificationEmail,
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

      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    test("should resend verification email", () => {
      skipBeforeEach = true;
      (useLogin as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: "validations.email_not_verified",
        email: "test@example.com",
      });

      setup();

      expect(
        screen.getByText("pages.login.resend_verification_email_message")
      ).toBeInTheDocument();
      fireEvent.click(
        screen.getByText("pages.login.resend_verification_email_message")
      );
      expect(mockResendVerificationEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
    });
  });

  describe("Google login", () => {
    test("should login with Google", async () => {
      (useGoogleLogin as jest.Mock).mockReturnValue(mockGoogleLogin);

      setup();

      const googleButton = screen.getByText("pages.login.google");
      fireEvent.click(googleButton);

      expect(mockGoogleLogin).toHaveBeenCalled();
    });

    test("calls googleAuth with the correct code on successful login", () => {
      const mockCode = "test-code";

      (useGoogleLogin as jest.Mock).mockImplementation(({ onSuccess }) => {
        return () => onSuccess({ code: mockCode });
      });

      setup();

      const googleButton = screen.getByText("pages.login.google");
      fireEvent.click(googleButton);

      expect(mockGoogleAuth).toHaveBeenCalledWith(mockCode);
    });

    test("logs error message when Google login fails", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      (useGoogleLogin as jest.Mock).mockImplementation(({ onError }) => {
        return () => onError();
      });

      setup();

      const googleButton = screen.getByText("pages.login.google");
      fireEvent.click(googleButton);

      expect(consoleSpy).toHaveBeenCalledWith("Login Failed");

      consoleSpy.mockRestore();
    });
  });
});
