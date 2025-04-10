import { renderHook, act } from "@testing-library/react";
import { useDeleteUser } from "../../hooks/useDeleteUser";
import { AuthContext } from "../../context/AuthContext";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import fetchMock from "jest-fetch-mock";
import React from "react";
import { AuthActionType, User } from "../../shared.types";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("useDeleteUser", () => {
  const mockDispatch = jest.fn();
  const mockNavigate = jest.fn();

  const mockUser = {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    token: "testtoken",
    isVerified: true,
    authSource: "self",
  } as User;

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    Storage.prototype.removeItem = jest.fn();
    fetchMock.resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should delete user successfully", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "User deleted" }));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={{ user: mockUser, dispatch: mockDispatch }}>
        <Router>{children}</Router>
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useDeleteUser(), { wrapper });

    await act(async () => {
      await result.current.deleteUser();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/user/testtoken`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer testtoken",
        },
      }
    );
    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActionType.DELETE_USER,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(mockNavigate).toHaveBeenCalledWith("/");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });

  test("should handle error when deleting user fails", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ error: "Failed to delete user" }),
      { status: 400 }
    );

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={{ user: mockUser, dispatch: mockDispatch }}>
        <Router>{children}</Router>
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useDeleteUser(), { wrapper });

    await act(async () => {
      await result.current.deleteUser();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/user/testtoken`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer testtoken",
        },
      }
    );
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Failed to delete user");
  });

  test("should call the fetch method with the good parameters", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ message: "User deleted" }));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={{ user: null, dispatch: mockDispatch }}>
        <Router>{children}</Router>
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useDeleteUser(), { wrapper });

    await act(async () => {
      await result.current.deleteUser();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/user/undefined`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer undefined",
        },
      }
    );
  });
});
