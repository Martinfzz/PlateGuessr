import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { AuthActionType } from "../shared.types";

export const useSetPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const setPassword = async (
    password: string,
    passwordConfirmation: string,
    token: string
  ) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/user/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, passwordConfirmation, token }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: AuthActionType.LOGIN, payload: json });

      setIsLoading(false);

      navigate("/");
    }
  };

  return { setPassword, error, isLoading, success };
};
