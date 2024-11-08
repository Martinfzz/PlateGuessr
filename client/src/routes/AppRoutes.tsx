import { FC } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import App from "../App";
import Error404 from "pages/error404";

const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
