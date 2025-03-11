import { renderHook, act } from "@testing-library/react";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AuthActionType } from "../../shared.types";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";

jest.mock("../../hooks/useAuthContext");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("useLogout", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useAuthContext as jest.Mock).mockReturnValue({ dispatch: mockDispatch });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    Storage.prototype.removeItem = jest.fn();
  });

  test("should logout successfully", () => {
    const { result } = renderHook(() => useLogout(), { wrapper: Router });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
    expect(mockDispatch).toHaveBeenCalledWith({ type: AuthActionType.LOGOUT });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
