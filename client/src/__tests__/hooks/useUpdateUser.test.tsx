import { renderHook, act } from "@testing-library/react";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { useAuthContext } from "../../hooks/useAuthContext";
import fetchMock from "jest-fetch-mock";
import { AuthActionType } from "../../shared.types";

jest.mock("../../hooks/useAuthContext");
fetchMock.enableMocks();

describe("useUpdateUser", () => {
  const mockDispatch = jest.fn();
  Storage.prototype.setItem = jest.fn();

  const updatedUser = {
    id: "1",
    username: "newtestuser",
    email: "test@example.com",
    token: "testtoken",
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("with connected user", () => {
    beforeEach(() => {
      (useAuthContext as jest.Mock).mockReturnValue({
        dispatch: mockDispatch,
        user: {
          id: "1",
          username: "testuser",
          email: "test@example.com",
          token: "testtoken",
        },
      });
    });

    test("should update user successfully", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(updatedUser));

      const { result } = renderHook(() => useUpdateUser());

      await act(async () => {
        await result.current.updateUser(
          "testuser",
          "newtestuser",
          "password123",
          "newpassword123"
        );
      });

      expect(fetchMock).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/user/testtoken`,
        expect.any(Object)
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(updatedUser)
      );
      expect(mockDispatch).toHaveBeenCalledWith({
        type: AuthActionType.UPDATE_USER,
        payload: updatedUser,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.success).toBe(true);
    });

    test("should handle update user error", async () => {
      const errorMessage = "Update failed";
      fetchMock.mockResponseOnce(JSON.stringify({ error: errorMessage }), {
        status: 400,
      });

      const { result } = renderHook(() => useUpdateUser());

      await act(async () => {
        await result.current.updateUser(
          "testuser",
          "newtestuser",
          "password123",
          "newpassword123"
        );
      });

      expect(fetchMock).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/user/testtoken`,
        expect.any(Object)
      );
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.success).toBe(null);
    });

    test("should call the fetch method with the good parameters", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(updatedUser));

      const { result } = renderHook(() => useUpdateUser());

      await act(async () => {
        await result.current.updateUser(
          "testuser",
          "newtestuser",
          "password123",
          "newpassword123"
        );
      });

      expect(fetchMock).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_URL}/api/user/testtoken`,
        expect.any(Object)
      );

      const fetchOptions = fetchMock.mock.calls[0][1];
      expect(fetchOptions?.method).toBe("PATCH");
      expect(fetchOptions?.headers).toEqual({
        "Content-Type": "application/json",
        Authorization: "Bearer testtoken",
      });
      expect(JSON.parse((fetchOptions?.body ?? "") as string)).toEqual({
        oldUsername: "testuser",
        newUsername: "newtestuser",
        currentPassword: "password123",
        password: "newpassword123",
      });
    });
  });

  describe("with disconnected user", () => {
    beforeEach(() => {
      (useAuthContext as jest.Mock).mockReturnValue({
        dispatch: mockDispatch,
        user: null,
      });
    });

    test("should call the fetch method with the good user parameters", async () => {
      fetchMock.mockResponseOnce(JSON.stringify(updatedUser));

      const { result } = renderHook(() => useUpdateUser());

      await act(async () => {
        await result.current.updateUser(
          "testuser",
          "newtestuser",
          "password123",
          "newpassword123"
        );
      });

      const fetchOptions = fetchMock.mock.calls[0][1];
      const fetchUrl = fetchMock.mock.calls[0][0];
      expect(fetchUrl).toEqual(
        `${process.env.REACT_APP_API_URL}/api/user/undefined`
      );
      expect(fetchOptions?.headers).toEqual({
        "Content-Type": "application/json",
        Authorization: "Bearer undefined",
      });
    });
  });
});
