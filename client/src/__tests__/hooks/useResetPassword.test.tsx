import { renderHook, act } from "@testing-library/react";
import { useResetPassword } from "../../hooks/useResetPassword";
import fetchMock from "jest-fetch-mock";
import { BrowserRouter as Router } from "react-router-dom";

describe("useResetPassword", () => {
  test("should resetPassword successfully", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: Router,
    });

    await act(async () => {
      await result.current.resetPassword("test@example.com");
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/user/reset-password`,
      expect.any(Object)
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.success).toBe(true);
  });

  test("should handle resetPassword error", async () => {
    const errorMessage = "Invalid credentials";
    fetchMock.mockResponseOnce(JSON.stringify({ error: errorMessage }), {
      status: 400,
    });

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: Router,
    });

    await act(async () => {
      await result.current.resetPassword("test@example.com");
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/user/reset-password`,
      expect.any(Object)
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.success).toBe(false);
  });
});
