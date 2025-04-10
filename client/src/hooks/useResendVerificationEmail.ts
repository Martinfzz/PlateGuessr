import { useTranslation } from "react-i18next";
import { notifyError, notifySuccess } from "../shared/helpers";

export const useResendVerificationEmail = () => {
  const { t } = useTranslation();

  const resendVerificationEmail = async (email: string) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/resend-verification-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    if (!response.ok) {
      notifyError(t("notifications.something_went_wrong"));
    }
    if (response.ok) {
      notifySuccess(t("notifications.email_sent"));
    }
  };

  return { resendVerificationEmail };
};
