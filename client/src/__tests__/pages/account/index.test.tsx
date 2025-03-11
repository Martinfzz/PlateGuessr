import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Account from "../../../pages/account";
import { useDeleteUser } from "../../../hooks/useDeleteUser";
import { AuthContext } from "../../../context/AuthContext";

jest.mock("../../../hooks/useDeleteUser", () => ({
  useDeleteUser: jest.fn(),
}));
jest.mock("../../../shared/helpers/toasts/Toasts", () => ({
  notifyError: jest.fn(),
}));

describe("Account Component", () => {
  const mockDeleteUser = jest.fn();

  const setup = () => {
    render(
      <AuthContext.Provider value={{ user: null, dispatch: jest.fn() }}>
        <Router>
          <Account />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    (useDeleteUser as jest.Mock).mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: false,
      error: null,
    });
    setup();
  });

  test("renders rigth Navbar text", () => {
    expect(screen.getByText("pages.account.heading")).toBeInTheDocument();
  });

  test("renders Form component", () => {
    expect(screen.getByTestId("account-form")).toBeInTheDocument();
  });

  test("opens and closes delete confirmation modal", () => {
    fireEvent.click(screen.getByText("pages.account.delete_account"));
    expect(screen.getByText("pages.account.are_you_sure")).toBeInTheDocument();
    expect(
      screen.getByText("pages.account.cannot_undo_action")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("app_common.cancel"));
    expect(
      screen.queryByText("pages.account.are_you_sure")
    ).not.toBeInTheDocument();
  });

  test("calls deleteUser and closes modal on confirm", async () => {
    fireEvent.click(screen.getByText("pages.account.delete_account"));
    fireEvent.click(screen.getByText("app_common.confirm"));

    await waitFor(() => expect(mockDeleteUser).toHaveBeenCalled());
    expect(
      screen.queryByText("Are you sure you want to delete your account?")
    ).not.toBeInTheDocument();
  });

  test("shows error notification on delete error", async () => {
    const { notifyError } = require("../../../shared/helpers/toasts/Toasts");
    (useDeleteUser as jest.Mock).mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: false,
      error: "Error",
    });

    fireEvent.click(screen.getByText("pages.account.delete_account"));
    fireEvent.click(screen.getByText("app_common.confirm"));

    await waitFor(() =>
      expect(notifyError).toHaveBeenCalledWith(
        "notifications.something_went_wrong"
      )
    );
  });
});
