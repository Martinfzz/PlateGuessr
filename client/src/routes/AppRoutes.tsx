import { FC } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import App from "../App";
import Error404 from "../pages/error404";
import LogIn from "../pages/login";
import SignUp from "../pages/signup";
import ResetPassword from "../pages/resetPassword";
import Account from "../pages/account";
import Country from "../pages/country";
import User from "../pages/user";

const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/me/settings" element={<Account />} />
        <Route path="/country/:id" element={<Country />} />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
