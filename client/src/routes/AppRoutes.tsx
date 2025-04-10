import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";
import Error404 from "../pages/error404";
import LogIn from "../pages/login";
import SignUp from "../pages/signup";
import ResetPassword from "../pages/resetPassword";
import Account from "../pages/account";
import Country from "../pages/country";
import User from "../pages/user";
import { ThemeContext } from "../Theme";
import PrivateRoutes from "./PrivateRoutes";
import SetPassword from "../pages/setPassword";

const AppRoutes = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`App ${theme}`}>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-password/:token" element={<SetPassword />} />
        <Route path="/country/:id" element={<Country />} />
        <Route path="/user/:id" element={<User />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/me/settings" element={<Account />} />
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
