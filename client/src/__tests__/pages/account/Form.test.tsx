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

jest.mock("../../../hooks/useUpdateUser");
jest.mock("../../../shared/helpers/toasts/Toasts", () => ({
  notifyError: jest.fn(),
  notifySuccess: jest.fn(),
}));

const user = {
  id: "1",
  username: "test",
  email: "test@example.com",
  token: "token123",
};

describe("AccountForm Component", () => {
  const mockUpdateUser = jest.fn();
  const toggleTheme = jest.fn();

  const setup = () => {
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
      user.username
    );
    expect(screen.getByLabelText("pages.account.current_password")).toHaveValue(
      ""
    );
    expect(screen.getByLabelText("pages.account.new_password")).toHaveValue("");
  });

  test("should have the right inputs", () => {
    expect(screen.getByLabelText("pages.account.nickname")).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText("pages.account.current_password"), {
      target: { value: "currentPassword" },
    });
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
    fireEvent.change(screen.getByLabelText("pages.account.current_password"), {
      target: { value: "currentPassword" },
    });
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
        <AuthContext.Provider value={{ user, dispatch: jest.fn() }}>
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
    fireEvent.change(screen.getByLabelText("pages.account.current_password"), {
      target: { value: "currentPassword" },
    });
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
    const { notifySuccess } = require("../../../shared/helpers/toasts/Toasts");
    (useUpdateUser as jest.Mock).mockReturnValue({
      updateUser: mockUpdateUser,
      isLoading: false,
      error: false,
      success: true,
    });

    await act(async () => {
      render(
        <AuthContext.Provider value={{ user, dispatch: jest.fn() }}>
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
    fireEvent.change(screen.getByLabelText("pages.account.current_password"), {
      target: { value: "currentPassword" },
    });
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
