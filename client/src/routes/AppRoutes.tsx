import { FC } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import App from "../App";
import Error404 from "../pages/error404";
import LogIn from "../pages/login";
import SignIn from "../pages/signin";
import ResetPassword from "../pages/resetPassword";

const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Error404 />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
