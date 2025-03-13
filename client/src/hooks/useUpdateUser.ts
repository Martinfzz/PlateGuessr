import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { AuthActionType } from "../shared.types";

export const useUpdateUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch, user } = useAuthContext();

  const updateUser = async (
    oldUsername: string,
    newUsername: string,
    currentPassword: string,
    password: string
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/user/" + user?.token, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        oldUsername,
        newUsername,
        currentPassword,
        password,
      }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: AuthActionType.UPDATE_USER, payload: json });

      // update loading state
      setIsLoading(false);

      setSuccess(true);
    }
  };

  return { updateUser, isLoading, error, success };
};
