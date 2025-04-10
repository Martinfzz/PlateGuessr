import { renderHook, act } from "@testing-library/react";
import { useResendVerificationEmail } from "../../hooks/useResendVerificationEmail";
import fetchMock from "jest-fetch-mock";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useResendVerificationEmail", () => {
  test("should authenticate with Google successfully", async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const { result } = renderHook(() => useResendVerificationEmail(), {
      wrapper: Router,
    });

    await act(async () => {
      await result.current.resendVerificationEmail("test@example.com");
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/user/resend-verification-email`,
      expect.any(Object)
    );
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

  test("should handle google authentication error", async () => {
    const errorMessage = "Invalid credentials";
    fetchMock.mockResponseOnce(JSON.stringify({ error: errorMessage }), {
      status: 400,
    });

    const { result } = renderHook(() => useResendVerificationEmail(), {
      wrapper: Router,
    });

    await act(async () => {
      await result.current.resendVerificationEmail("test@example.com");
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.REACT_APP_API_URL}/api/user/resend-verification-email`,
      expect.any(Object)
    );
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
