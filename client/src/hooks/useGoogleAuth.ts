import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { AuthActionType } from "../shared.types";
import { useTranslation } from "react-i18next";
import { notifyError } from "../shared/helpers";

export const useGoogleAuth = () => {
  const { dispatch } = useAuthContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const googleAuth = async (code: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/auth/google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }
    );
    const json = await response.json();

    if (!response.ok) {
      notifyError(t("notifications.something_went_wrong"));
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: AuthActionType.LOGIN, payload: json });

      navigate("/");
    }
  };

  return { googleAuth };
};
