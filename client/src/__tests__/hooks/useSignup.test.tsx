import { renderHook, act } from "@testing-library/react";
import { useSignup } from "../../hooks/useSignup";
import fetchMock from "jest-fetch-mock";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("useSignup", () => {
  const mockNavigate = jest.fn();
  Storage.prototype.setItem = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    fetchMock.resetMocks();
  });

  test("should signup successfully", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const { result } = renderHook(() => useSignup(), { wrapper: Router });

    await act(async () => {
      await result.current.signup(
        "test@example.com",
        "password123",
        "password123"
      );
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/user/signup`,
      expect.any(Object)
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(toast.success).toHaveBeenCalledWith("notifications.email_sent", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      className: "green",
    });
  });

  test("should handle signup error", async () => {
    const errorMessage = "Passwords do not match";
    fetchMock.mockResponseOnce(JSON.stringify({ error: errorMessage }), {
      status: 400,
    });

    const { result } = renderHook(() => useSignup(), { wrapper: Router });

    await act(async () => {
      await result.current.signup(
        "test@example.com",
        "password123",
        "password456"
      );
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/user/signup`,
      expect.any(Object)
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });
});
