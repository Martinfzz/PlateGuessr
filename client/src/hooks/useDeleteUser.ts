import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { AuthActionType } from "shared.types";

export const useDeleteUser = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch, user } = useAuthContext();
  const navigate = useNavigate();

  const deleteUser = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/user/" + user?.token, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save the user to local storage
      // remove user from storage
      localStorage.removeItem("user");

      // update the auth context
      dispatch({ type: AuthActionType.DELETE_USER });

      navigate("/");
    }
  };

  return { deleteUser, isLoading, error };
};
