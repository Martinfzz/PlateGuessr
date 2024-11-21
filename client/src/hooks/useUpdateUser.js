import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useUpdateUser = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch, user } = useAuthContext();

  const updateUser = async (username, currentPassword, password) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const response = await fetch("/api/user/" + user.token, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ username, currentPassword, password }),
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
      dispatch({ type: "UPDATE_USER", payload: json });

      // update loading state
      setIsLoading(false);

      setSuccess(true);
    }
  };

  return { updateUser, isLoading, error, success };
};
