import { renderHook, act } from "@testing-library/react";
import { useSetPassword } from "../../hooks/useSetPassword";
import { useAuthContext } from "../../hooks/useAuthContext";
import fetchMock from "jest-fetch-mock";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { AuthActionType } from "../../shared.types";

jest.mock("../../hooks/useAuthContext");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
fetchMock.enableMocks();

describe("useSetPassword", () => {
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

  test("should setPassword successfully", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));

    const { result } = renderHook(() => useSetPassword(), { wrapper: Router });

    await act(async () => {
      await result.current.setPassword(
        "test@example.com",
        "password123",
        "token123"
      );
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/user/set-password",
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
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("should handle setPassword error", async () => {
    const errorMessage = "Invalid credentials";
    fetchMock.mockResponseOnce(JSON.stringify({ error: errorMessage }), {
      status: 400,
    });

    const { result } = renderHook(() => useSetPassword(), { wrapper: Router });

    await act(async () => {
      await result.current.setPassword(
        "test@example.com",
        "wrongpassword",
        "token123"
      );
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/user/set-password",
      expect.any(Object)
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
});
