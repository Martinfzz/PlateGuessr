import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import AccountForm from "../../../pages/account/Form";
import { useUpdateUser } from "../../../hooks/useUpdateUser";
import { AuthContext } from "../../../context/AuthContext";
import { ThemeContext } from "../../../Theme";
import { User } from "shared.types";

jest.mock("../../../hooks/useUpdateUser");
jest.mock("../../../shared/helpers/toasts/Toasts", () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
}));

const mockUser: User = {
  id: "1",
  username: "test",
  email: "test@example.com",
  token: "token123",
  isVerified: true,
  authSource: "self",
};

describe("AccountForm Component", () => {
  const mockUpdateUser = jest.fn();
  const toggleTheme = jest.fn();

  const setup = (user: User = mockUser) => {
    render(
      <AuthContext.Provider value={{ user, dispatch: jest.fn() }}>
        <ThemeContext.Provider value={{ theme: "dark-theme", toggleTheme }}>
          <Router>
            <AccountForm />
          </Router>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    );
  };

  describe("Main component", () => {
    beforeEach(() => {
      (useUpdateUser as jest.Mock).mockReturnValue({
        updateUser: mockUpdateUser,
        isLoading: false,
        error: null,
        success: false,
      });
      setup();
    });

    test("renders AccountForm component", () => {
      expect(screen.getByTestId("account-form")).toBeInTheDocument();
    });

    test("should have the right initial values", () => {
      expect(screen.getByLabelText("pages.account.nickname")).toHaveValue(
        mockUser.username
      );
      expect(
        screen.getByLabelText("pages.account.current_password")
      ).toHaveValue("");
      expect(screen.getByLabelText("pages.account.new_password")).toHaveValue(
        ""
      );
    });

    test("should have the right inputs", () => {
      expect(
        screen.getByLabelText("pages.account.nickname")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("pages.account.current_password")
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("pages.account.new_password")
      ).toBeInTheDocument();
    });

    test("renders divider", () => {
      expect(
        screen.getByText("pages.account.change_password")
      ).toBeInTheDocument();
    });

    test("calls updateUser on form submit without strong password", async () => {
      fireEvent.change(screen.getByLabelText("pages.account.nickname"), {
        target: { value: "newNickname" },
      });
      fireEvent.change(
        screen.getByLabelText("pages.account.current_password"),
        {
          target: { value: "currentPassword" },
        }
      );
      fireEvent.change(screen.getByLabelText("pages.account.new_password"), {
        target: { value: "newPassword" },
      });

      const saveButton = screen.getByText("pages.account.save_changes");

      expect(
        screen.queryByText("validations.password_validation")
      ).not.toBeInTheDocument();

      await fireEvent.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText("validations.password_validation")
        ).toBeInTheDocument();
      });
    });

    test("calls updateUser on form submit with strong password", async () => {
      fireEvent.change(screen.getByLabelText("pages.account.nickname"), {
        target: { value: "newNickname" },
      });
      fireEvent.change(
        screen.getByLabelText("pages.account.current_password"),
        {
          target: { value: "currentPassword" },
        }
      );
      fireEvent.change(screen.getByLabelText("pages.account.new_password"), {
        target: { value: "Password123!" },
      });

      await fireEvent.click(screen.getByText("pages.account.save_changes"));

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith(
          "test",
          "newNickname",
          "currentPassword",
          "Password123!"
        );
      });
      expect(
        screen.queryByText("validations.password_validation")
      ).not.toBeInTheDocument();
    });
  });

  describe("AccountForm according to user authSource", () => {
    test("should not show password inputs if user is authenticated with Google", () => {
      const user: User = {
        id: "1",
        username: "test",
        email: "test@example.com",
        token: "token123",
        isVerified: true,
        authSource: "google",
      };

      setup(user);

      expect(
        screen.queryByLabelText("pages.account.current_password")
      ).toBeNull();
      expect(screen.queryByLabelText("pages.account.new_password")).toBeNull();
    });

    test("should show password inputs if user is authenticated with self", () => {
      setup();

      expect(
        screen.queryByLabelText("pages.account.current_password")
      ).toBeVisible();
      expect(
        screen.queryByLabelText("pages.account.new_password")
      ).toBeVisible();
    });
  });

  describe("AccountForm Component notifications", () => {
    const mockUpdateUser = jest.fn();
    const toggleTheme = jest.fn();

    test("shows error notification on update error", async () => {
      const { notifyError } = require("../../../shared/helpers/toasts/Toasts");
      (useUpdateUser as jest.Mock).mockReturnValue({
        updateUser: mockUpdateUser,
        isLoading: false,
        error: true,
        success: false,
      });

      await act(async () => {
        render(
          <AuthContext.Provider value={{ user: mockUser, dispatch: jest.fn() }}>
            <ThemeContext.Provider value={{ theme: "dark-theme", toggleTheme }}>
              <Router>
                <AccountForm />
              </Router>
            </ThemeContext.Provider>
          </AuthContext.Provider>
        );
      });

      fireEvent.change(screen.getByLabelText("pages.account.nickname"), {
        target: { value: "newNickname" },
      });
      fireEvent.change(
        screen.getByLabelText("pages.account.current_password"),
        {
          target: { value: "currentPassword" },
        }
      );
      fireEvent.change(screen.getByLabelText("pages.account.new_password"), {
        target: { value: "Password123!" },
      });

      fireEvent.click(screen.getByText("pages.account.save_changes"));

      await waitFor(() =>
        expect(notifyError).toHaveBeenCalledWith(
          "notifications.something_went_wrong"
        )
      );
    });

    test("shows success notification on update success", async () => {
      const {
        notifySuccess,
      } = require("../../../shared/helpers/toasts/Toasts");
      (useUpdateUser as jest.Mock).mockReturnValue({
        updateUser: mockUpdateUser,
        isLoading: false,
        error: false,
        success: true,
      });

      await act(async () => {
        render(
          <AuthContext.Provider value={{ user: mockUser, dispatch: jest.fn() }}>
            <ThemeContext.Provider value={{ theme: "dark-theme", toggleTheme }}>
              <Router>
                <AccountForm />
              </Router>
            </ThemeContext.Provider>
          </AuthContext.Provider>
        );
      });

      fireEvent.change(screen.getByLabelText("pages.account.nickname"), {
        target: { value: "newNickname" },
      });
      fireEvent.change(
        screen.getByLabelText("pages.account.current_password"),
        {
          target: { value: "currentPassword" },
        }
      );
      fireEvent.change(screen.getByLabelText("pages.account.new_password"), {
        target: { value: "Password123!" },
      });

      fireEvent.click(screen.getByText("pages.account.save_changes"));

      await waitFor(() =>
        expect(notifySuccess).toHaveBeenCalledWith(
          "notifications.profile_updated"
        )
      );
    });
  });
});
