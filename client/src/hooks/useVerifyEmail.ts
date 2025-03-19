import { useAuthContext } from "./useAuthContext";
import { AuthActionType } from "../shared.types";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../shared/helpers";
import { useTranslation } from "react-i18next";

export const useVerifyEmail = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const verifyEmail = async (emailToken: string) => {
    const response = await fetch("/api/user/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailToken }),
    });
    const json = await response.json();

    if (!response.ok) {
      notifyError(t("notifications.something_went_wrong"));
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: AuthActionType.UPDATE_USER, payload: json });

      notifySuccess(t("notifications.profile_verified"));
    }

    navigate("/");
  };

  return { verifyEmail };
};
