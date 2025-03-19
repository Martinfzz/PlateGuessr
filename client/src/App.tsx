import React, { useContext, useEffect } from "react";
import MainLayout from "./components/Maps/MainLayout";
import { Outlet, useSearchParams } from "react-router-dom";
import { ThemeContext } from "./Theme";
import { useAuthContext } from "./hooks/useAuthContext";
import { useVerifyEmail } from "./hooks/useVerifyEmail";

function App() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuthContext();
  const [searchParams] = useSearchParams();
  const { verifyEmail } = useVerifyEmail();
  const emailToken = searchParams.get("emailToken");

  useEffect(() => {
    if (!user?.isVerified && emailToken) {
      verifyEmail(emailToken);
    }
  }, [emailToken, user?.isVerified, verifyEmail]);

  return (
    <div className={`App ${theme}`} data-testid="app-container">
      <MainLayout />
      <Outlet />
    </div>
  );
}

export default App;
