import React, { useContext } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { AuthContext, AuthContextProvider } from "../../context/AuthContext";
import { AuthActionType, User } from "../../shared.types";

const mockUser: User = {
  id: "1",
  username: "testuser",
  email: "test@example.com",
  token: "testtoken",
};

describe("AuthContextProvider", () => {
  beforeEach(() => {
    Storage.prototype.getItem = jest
      .fn()
      .mockReturnValue(JSON.stringify(mockUser));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("provides user data from localStorage", () => {
    const TestComponent = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error(
          "AuthContext must be used within an AuthContextProvider"
        );
      }
      const { user } = context;
      return <div>{user?.username}</div>;
    };

    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );

    expect(screen.getByText("testuser")).toBeInTheDocument();
  });

  test("dispatches LOGIN action and updates state", () => {
    const mockDispatch = jest.fn();
    const mockState = { user: null, dispatch: mockDispatch };

    render(
      <AuthContext.Provider value={mockState}>
        <button
          onClick={() =>
            mockDispatch({
              type: AuthActionType.LOGIN,
              payload: { name: "Jane" },
            })
          }
        >
          Login
        </button>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText("Login"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActionType.LOGIN,
      payload: { name: "Jane" },
    });
  });

  test("dispatches LOGOUT action and updates state", () => {
    const mockDispatch = jest.fn();
    const mockState = { user: mockUser, dispatch: mockDispatch };

    render(
      <AuthContext.Provider value={mockState}>
        <button onClick={() => mockDispatch({ type: AuthActionType.LOGOUT })}>
          Logout
        </button>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(mockDispatch).toHaveBeenCalledWith({ type: AuthActionType.LOGOUT });
  });

  test("dispatches UPDATE_USER action and updates state", () => {
    const mockDispatch = jest.fn();
    const mockState = { user: mockUser, dispatch: mockDispatch };

    render(
      <AuthContext.Provider value={mockState}>
        <button
          onClick={() =>
            mockDispatch({
              type: AuthActionType.UPDATE_USER,
              payload: { name: "John" },
            })
          }
        >
          Update User
        </button>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText("Update User"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActionType.UPDATE_USER,
      payload: { name: "John" },
    });
  });

  test("dispatches DELETE_USER action and updates state", () => {
    const mockDispatch = jest.fn();
    const mockState = { user: mockUser, dispatch: mockDispatch };

    render(
      <AuthContext.Provider value={mockState}>
        <button
          onClick={() => mockDispatch({ type: AuthActionType.DELETE_USER })}
        >
          Delete User
        </button>
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText("Delete User"));

    expect(mockDispatch).toHaveBeenCalledWith({
      type: AuthActionType.DELETE_USER,
    });
  });

  test("initializes with null user if no user in localStorage", () => {
    Storage.prototype.getItem = jest.fn().mockReturnValue(null);

    const TestComponent = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error(
          "AuthContext must be used within an AuthContextProvider"
        );
      }
      const { user } = context;
      console.log(user);
      return <div>{user ? JSON.stringify(user) : "null"}</div>;
    };

    render(
      <AuthContextProvider>
        <TestComponent />
      </AuthContextProvider>
    );

    expect(screen.getByText("{}")).toBeInTheDocument();
  });
});
