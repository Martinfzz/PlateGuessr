import { renderHook, act } from "@testing-library/react";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import fetchMock from "jest-fetch-mock";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AuthActionType } from "../../shared.types";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("../../hooks/useAuthContext");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("useGoogleAuth", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();
  Storage.prototype.setItem = jest.fn();

  const user = {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    token: "testtoken",
  };

  beforeEach(() => {
    (useAuthContext as jest.Mock).mockReturnValue({ dispatch: mockDispatch });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    fetchMock.resetMocks();
  });

  test("should authenticate with Google successfully", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const { result } = renderHook(() => useGoogleAuth(), { wrapper: Router });

    await act(async () => {
      await result.current.googleAuth("code123");
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/user/auth/google",
      expect.any(Object)
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "user",
      JSON.stringify(user)
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActionType.LOGIN,
      payload: user,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("should handle google authentication error", async () => {
    const errorMessage = "Invalid credentials";
    fetchMock.mockResponseOnce(JSON.stringify({ error: errorMessage }), {
      status: 400,
    });

    const { result } = renderHook(() => useGoogleAuth(), { wrapper: Router });

    await act(async () => {
      await result.current.googleAuth("code123");
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/user/auth/google",
      expect.any(Object)
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      "notifications.something_went_wrong",
      {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        className: "red",
      }
    );
  });
});
