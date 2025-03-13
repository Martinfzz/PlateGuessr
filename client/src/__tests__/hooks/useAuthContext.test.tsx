import { render, renderHook } from "@testing-library/react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AuthContext } from "../../context/AuthContext";
import React from "react";

const MockComponent = () => {
  useAuthContext(); // This will throw if not wrapped with AuthContextProvider
  return <div>Test Component</div>;
};

describe("useAuthContext", () => {
  test("should throw error if used outside AuthContextProvider", () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<MockComponent />);
    }).toThrow("useAuthContext must be used inside an AuthContextProvider");

    consoleErrorSpy.mockRestore();
  });

  test("should return context value if used inside AuthContextProvider", () => {
    const mockContextValue = {
      user: {
        name: "Test User",
        id: "1",
        username: "testuser",
        email: "test@example.com",
        token: "testtoken",
      },
      dispatch: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={mockContextValue}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuthContext(), { wrapper });

    expect(result.current).toEqual(mockContextValue);
  });
});
