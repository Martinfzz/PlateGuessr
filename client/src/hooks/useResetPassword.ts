import { useState } from "react";

export const useResetPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/user/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      setIsLoading(false);
      setSuccess(true);
    }
  };

  return { resetPassword, error, success, isLoading };
};
